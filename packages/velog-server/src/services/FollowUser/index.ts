import { BadRequestError } from '@errors/BadRequestErrors.js'
import { ConfilctError } from '@errors/ConfilctError.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { GetFollowInput } from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService.js'
import { FollowUser, Prisma, UserProfile } from '@prisma/velog-rds/client'
import { injectable, singleton } from 'tsyringe'
import { UserService } from '@services/UserService/index.js'
import { FeedService } from '@services/FeedService/index.js'
import { NotificationService } from '@services/NotificationService/index.js'

interface Service {
  isFollowed({ followingUserId, followerUserId }: isFollowedArgs): Promise<boolean>
  follow({ followingUserId, followerUserId }: FollowArgs): Promise<void>
  unfollow({ followingUserId, followerUserId }: UnfollowArgs): Promise<void>
  getFollowers(input: GetFollowInput): Promise<FollowResult[]>
  getFollowersCount(username: string): Promise<number>
  getFollowings(input: GetFollowInput): Promise<FollowResult[]>
  getFollowingsCount(username: string): Promise<number>
}

@injectable()
@singleton()
export class FollowUserService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly userService: UserService,
    private readonly feedService: FeedService,
    private readonly notificationService: NotificationService,
  ) {}
  public async isFollowed({ followingUserId, followerUserId }: FollowArgs): Promise<boolean> {
    if (!followingUserId || !followerUserId) return false

    const followingUser = await this.userService.findById(followingUserId)

    if (!followingUser) {
      throw new NotFoundError('Not fond following user')
    }

    return !!(await this.findFollowRelationship({ followingUserId, followerUserId }))
  }
  private async findFollowRelationship({
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
      throw new UnauthorizedError('Not logged in')
    }

    if (followingUserId === followerUserId) {
      throw new ConfilctError('Users cannot follow themselves')
    }

    const following = await this.userService.findById(followingUserId)

    if (!following) {
      throw new NotFoundError('Not found following user')
    }

    const follower = await this.db.user.findUnique({
      where: {
        id: followerUserId,
      },
      include: {
        profile: true,
      },
    })

    if (!follower) {
      throw new NotFoundError('Not found follower user')
    }

    const exists = await this.db.followUser.findFirst({
      where: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })

    if (exists) {
      throw new ConfilctError('Already relationship')
    }

    const relationship = await this.db.followUser.create({
      data: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })

    // create feed
    await this.feedService.createFeedByFollow({ followerUserId, followingUserId })

    // create notification
    await this.notificationService.createOrUpdate({
      actionId: relationship.id,
      fkUserId: followingUserId,
      type: 'follow',
      actorId: followerUserId,
      action: {
        follow: {
          actor_user_id: follower.id,
          actor_display_name: follower.profile?.display_name || '',
          actor_thumbnail: follower.profile?.thumbnail || '',
          actor_username: follower.username,
          follow_id: relationship.id,
          type: 'follow',
        },
      },
    })
  }
  public async unfollow({ followingUserId, followerUserId }: FollowArgs): Promise<void> {
    if (!followingUserId) {
      throw new BadRequestError('following uesrId is required')
    }

    if (!followerUserId) {
      throw new UnauthorizedError('Not logged in')
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

    const relationship = await this.db.followUser.findFirst({
      where: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })

    if (!relationship) {
      throw new NotFoundError('Not found relationship')
    }

    await this.db.followUser.delete({
      where: {
        id: relationship.id,
      },
    })

    // delete feed
    await this.feedService.deleteFeedByUnfollow({
      followerUserId,
      followingUserId,
    })

    // remove notification
    await this.notificationService.remove({
      actionId: relationship.id,
      actorId: followerUserId,
      fkUserId: followingUserId,
      type: 'follow',
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

type isFollowedArgs = FollowArgs

type FollowArgs = {
  followingUserId?: string
  followerUserId?: string
}

type UnfollowArgs = FollowArgs

type FollowResult = {
  id: string
  userId: string
  username: string
  is_followed: boolean
  profile: UserProfile
}
