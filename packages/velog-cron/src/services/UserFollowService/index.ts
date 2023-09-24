import { DbService } from '@lib/db/DbService.js'
import { User } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getFollowings(writer_id: string): Promise<User[]>
}

@injectable()
@singleton()
export class UserFollowService implements Service {
  constructor(private readonly db: DbService) {}
  public async getFollowings(userId: string): Promise<User[]> {
    const followUser = await this.db.followUser.findMany({
      where: {
        fk_follow_user_id: userId,
      },
      select: {
        following: true,
      },
    })
    const followings = followUser.map((follow) => follow.following)
    return followings
  }
}
