import { UserService } from '@services/UserService/index.js'
import { DbService } from '@lib/db/DbService.js'
import { Prisma } from '@packages/database/src/velog-rds/index.mjs'
import { injectable, singleton } from 'tsyringe'
import { NotFoundError } from '@errors/NotfoundError.js'

interface Service {
  getFollowings(fk_follower_id: string): Promise<User[]>
  getFollowers(fk_following_id: string): Promise<User[]>
}

@injectable()
@singleton()
export class FollowUserService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly userService: UserService,
  ) {}
  public async getFollowings(fk_follower_id: string): Promise<User[]> {
    const follower = await this.userService.findByUserId(fk_follower_id)

    if (!follower) {
      throw new NotFoundError('Not found Follower')
    }

    const relationship = await this.db.followUser.findMany({
      where: {
        fk_follower_user_id: fk_follower_id,
      },
      select: {
        following: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                display_name: true,
                short_bio: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    })
    const followings = relationship.map((follow) => follow.following!)
    return followings
  }
  public async getFollowers(fk_following_id: string): Promise<User[]> {
    const following = await this.userService.findByUserId(fk_following_id)

    if (!following) {
      return []
    }

    const relationship = await this.db.followUser.findMany({
      where: {
        fk_following_user_id: fk_following_id,
      },
      select: {
        follower: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                display_name: true,
                short_bio: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    })
    const followers = relationship.map((follow) => follow.follower!)
    return followers
  }
}

type User = Prisma.UserGetPayload<{
  select: {
    id: true
    username: true
    profile: {
      select: {
        display_name: true
        short_bio: true
        thumbnail: true
      }
    }
  }
}>
