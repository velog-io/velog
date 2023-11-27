import { BadRequestError } from '@errors/BadRequestErrors.js'
import { ConfilctError } from '@errors/ConfilctError.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { GetFollowInput } from '@graphql/generated'
import { DbService } from '@lib/db/DbService.js'
import { FollowUser, Prisma, UserProfile } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import { UserService } from '@services/UserService/index.js'
import { RedisService } from '@lib/redis/RedisService.js'

interface Service {
  findFollowRelationship({
    followingUserId,
    followerUserId,
  }: FollowArgs): Promise<FollowUser | null>
  isFollowed({ followingUserId, followerUserId }: FollowArgs): Promise<boolean>
  follow({ followingUserId, followerUserId }: FollowArgs): Promise<void>
  unfollow({ followingUserId, followerUserId }: FollowArgs): Promise<void>
  getFollowers(input: GetFollowInput): Promise<FollowResult[]>
  getFollowersCount(username: string): Promise<number>
  getFollowings(input: GetFollowInput): Promise<FollowResult[]>
  getFollowingsCount(username: string): Promise<number>
}

@injectable()
@singleton()
export class FollowService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly redis: RedisService,
    private readonly userService: UserService,
  ) {}
  public async isFollowed({ followingUserId, followerUserId }: FollowArgs): Promise<boolean> {
    if (!followingUserId || !followerUserId) return false
    return !!(await this.findFollowRelationship({ followingUserId, followerUserId }))
  }
  public async findFollowRelationship({
    followingUserId,
    followerUserId,
  }: FollowArgs): Promise<FollowUser | null> {
    return await this.db.followUser.findFirst({
      where: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })
  }
  public async follow({ followingUserId, followerUserId }: FollowArgs): Promise<void> {
    if (!followingUserId) {
      throw new BadRequestError('following userId is required')
    }

    if (!followerUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    if (followingUserId === followerUserId) {
      throw new ConfilctError('Users cannot follow themselves')
    }

    const following = await this.db.user.findUnique({
      where: {
        id: followingUserId,
      },
    })

    if (!following) {
      throw new NotFoundError('Not found following User')
    }

    const relationship = await this.db.followUser.findFirst({
      where: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })

    if (relationship) {
      throw new ConfilctError('Already relationship')
    }

    await this.db.followUser.create({
      data: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })
  }
  public async unfollow({ followingUserId, followerUserId }: FollowArgs): Promise<void> {
    if (!followingUserId) {
      throw new BadRequestError('following uesrId is required')
    }

    if (!followerUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    if (followingUserId === followerUserId) {
      throw new ConfilctError('Not allowed')
    }

    const following = await this.db.user.findUnique({
      where: {
        id: followerUserId,
      },
    })

    if (!following) {
      throw new NotFoundError('Not found follower User')
    }

    const follow = await this.db.followUser.findFirst({
      where: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })

    if (!follow) {
      throw new NotFoundError('Not found relationship')
    }

    await this.db.followUser.delete({
      where: {
        id: follow.id,
      },
    })
  }
  public async getFollowers(input: GetFollowInput, signedUserId?: string): Promise<FollowResult[]> {
    const { username, cursor, limit = 10 } = input

    if (limit > 100) {
      throw new BadRequestError('Max limit is 100')
    }

    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    const whereInput: Prisma.FollowUserWhereInput = {
      fk_following_user_id: user.id,
    }

    if (cursor) {
      const cursorData = await this.db.followUser.findUnique({
        where: {
          id: cursor,
        },
      })

      if (!cursorData) {
        throw new NotFoundError('Invalid cursor')
      }

      const AND: any[] = [
        {
          created_at: {
            lt: cursorData.created_at,
          },
        },
      ]
      Object.assign(whereInput, { AND })
    }

    const followers = await this.db.followUser.findMany({
      where: whereInput,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        follower: {
          include: {
            profile: true,
          },
        },
      },
    })
    const promises = followers.map(async (relationship) => {
      const { id: followingUserId, username, profile } = relationship.follower
      const is_followed = await this.isFollowed({
        followingUserId,
        followerUserId: signedUserId,
      })
      return {
        id: relationship.id,
        userId: followingUserId,
        username,
        profile: profile!,
        is_followed,
      }
    })

    return await Promise.all(promises)
  }
  public async getFollowersCount(username: string): Promise<number> {
    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    const followersCount = await this.db.followUser.count({
      where: {
        fk_following_user_id: user.id,
      },
    })

    return followersCount
  }
  public async getFollowings(
    input: GetFollowInput,
    signedUserId?: string,
  ): Promise<FollowResult[]> {
    const { username, cursor, limit = 10 } = input

    if (limit > 100) {
      throw new BadRequestError('Max limit is 100')
    }

    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    const whereInput: Prisma.FollowUserWhereInput = {
      fk_follower_user_id: user.id,
    }

    if (cursor) {
      const cursorData = await this.db.followUser.findUnique({
        where: {
          id: cursor,
        },
      })

      if (!cursorData) {
        throw new NotFoundError('Invalid cursor')
      }

      const AND: any[] = [
        {
          created_at: {
            lt: cursorData.created_at,
          },
        },
      ]
      Object.assign(whereInput, { AND })
    }

    const followings = await this.db.followUser.findMany({
      where: whereInput,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        following: {
          include: {
            profile: true,
          },
        },
      },
    })
    const promises = followings.map(async (relationship) => {
      const { id: followingUserId, profile, username } = relationship.following
      const is_followed = await this.isFollowed({
        followingUserId,
        followerUserId: signedUserId,
      })
      return {
        id: relationship.id,
        userId: followingUserId,
        username,
        profile: profile!,
        is_followed,
      }
    })

    return await Promise.all(promises)
  }
  public async getFollowingsCount(username: string): Promise<number> {
    const user = await this.userService.findByUsername(username)

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    const followingsCount = await this.db.followUser.count({
      where: {
        fk_follower_user_id: user.id,
      },
    })

    return followingsCount
  }
}

type FollowArgs = {
  followingUserId?: string
  followerUserId?: string
}

type FollowResult = {
  id: string
  userId: string
  username: string
  is_followed: boolean
  profile: UserProfile
}
