import { DbService } from '@lib/db/DbService.js'
import { User } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getFollowings(fk_follower_id: string): Promise<User[]>
}

@injectable()
@singleton()
export class FollowUserService implements Service {
  constructor(private readonly db: DbService) {}
  public async getFollowings(fk_follower_id: string): Promise<User[]> {
    const followUser = await this.db.followUser.findMany({
      where: {
        fk_follower_user_id: fk_follower_id,
      },
      select: {
        following: true,
      },
    })
    const followings = followUser.map((follow) => follow.following)
    return followings
  }
}
