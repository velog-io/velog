import { BadRequestError } from '@errors/BadRequestErrors.js'
import { ConfilctError } from '@errors/ConfilctError.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { User } from '@graphql/generated'
import { DbService } from '@lib/db/DbService.js'
import { FollowUser } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findFollowRelationship(userId: string, followUserId: string): Promise<FollowUser | null>
  isFollowed(follwingUserId: string, followerUserId: string): Promise<boolean>
  follow(userId: string, followUserId: string): Promise<void>
  unfollow(userId: string, followUserId: string): Promise<void>
  getFollowing(userId: string): Promise<User[]>
  getFollower(userId: string): Promise<User[]>
  recommendedFollowers(): Promise<User[]>
}

@injectable()
@singleton()
export class UserFollowService implements Service {
  constructor(private readonly db: DbService) {}
  public async isFollowed(followingUserId: string, followerUserId: string): Promise<boolean> {
    return !!(await this.findFollowRelationship(followingUserId, followerUserId))
  }
  public async findFollowRelationship(
    followingUserId: string,
    followerUserId: string,
  ): Promise<FollowUser | null> {
    return await this.db.followUser.findFirst({
      where: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })
  }
  public async follow(followingUserId?: string, followerUserId?: string): Promise<void> {
    if (!followerUserId) {
      throw new BadRequestError('followUesrId is required')
    }

    if (!followingUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    const follower = await this.db.user.findUnique({
      where: {
        id: followerUserId,
      },
    })

    if (!follower) {
      throw new NotFoundError('Not found follower User')
    }

    const existingFollower = await this.db.followUser.findFirst({
      where: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })

    if (existingFollower) {
      throw new ConfilctError('ALREADY_FOLLOWER')
    }

    if (followingUserId === followerUserId) {
      throw new ConfilctError('Users cannot follow themselves.')
    }

    await this.db.followUser.create({
      data: {
        fk_following_user_id: followingUserId,
        fk_follower_user_id: followerUserId,
      },
    })
  }
  public async unfollow(followingUserId?: string, followerUserId?: string): Promise<void> {
    if (!followerUserId) {
      throw new BadRequestError('followUesrId is required')
    }

    if (!followingUserId) {
      throw new UnauthorizedError('Not Logged In')
    }
    const follower = await this.db.user.findUnique({
      where: {
        id: followerUserId,
      },
    })

    if (!follower) {
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
  public async getFollower(userId: string): Promise<User[]> {}
  public async getFollowing(userId: string): Promise<User[]> {}
  public async recommendedFollowers(): Promise<User[]> {}
}
