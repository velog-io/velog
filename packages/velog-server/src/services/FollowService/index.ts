import { BadRequestError } from '@errors/BadRequestErrors.js'
import { ConfilctError } from '@errors/ConfilctError.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { RedisService } from '@lib/redis/RedisService.js'
import {
  FollowersInput,
  FollowingsInput,
  RecommedFollowingsResult,
  RecommendFollowings,
} from '@graphql/generated'
import { DbService } from '@lib/db/DbService.js'
import { FollowUser, Prisma, User } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import { UserService } from '@services/UserService/index.js'

interface Service {
  findFollowRelationship({
    followingUserId,
    followerUserId,
  }: FollowArgs): Promise<FollowUser | null>
  isFollowed({ followingUserId, followerUserId }: FollowArgs): Promise<boolean>
  follow({ followingUserId, followerUserId }: FollowArgs): Promise<void>
  unfollow({ followingUserId, followerUserId }: FollowArgs): Promise<void>
  getFollowers(input: FollowersInput): Promise<User[]>
  getFollowersCount(username: string): Promise<number>
  getFollowings(input: FollowingsInput): Promise<User[]>
  getFollowingsCount(username: string): Promise<number>
  getRecommededFollowers(page?: number, take?: number): Promise<RecommedFollowingsResult>
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
  public async getFollowers(input: FollowersInput): Promise<User[]> {
    const { username, cursor, take = 10 } = input

    if (take > 100) {
      throw new BadRequestError('Max take is 100')
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
      take,
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
    return followers.map((relationship) => relationship.follower)
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
  public async getFollowings(input: FollowingsInput): Promise<User[]> {
    const { username, cursor, take = 10 } = input

    if (take > 100) {
      throw new BadRequestError('Max take is 100')
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
      take,
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
    return followings.map((relationship) => relationship.following)
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
  public async getRecommededFollowers(
    page?: number,
    take?: number,
  ): Promise<RecommedFollowingsResult> {
    if (!page || !take) {
      throw new BadRequestError()
    }

    if (take > 100) {
      throw new BadRequestError('Max take is 100')
    }

    if (page < 0 || take < 0) {
      throw new BadRequestError('Invalid input, input must be a non-negative number')
    }

    const key = this.redis.generateKey.recommendedFollowingsKey()
    const followings = await this.redis.get(key)

    if (!followings) {
      return {
        totalPage: 0,
        followings: [],
      }
    }

    const recommededFollowings: RecommendFollowings[] = JSON.parse(followings)

    const offset = (page - 1) * take
    const totalPage = Math.ceil(recommededFollowings.length / take)

    const result = {
      totalPage,
      followings: recommededFollowings.slice(offset, offset + take),
    }

    return result
  }
}

type FollowArgs = {
  followingUserId?: string
  followerUserId?: string
}
