import { DbService } from '@lib/db/DbService.js'
import { FollowService } from '@services/FollowService'

import { injectable, singleton } from 'tsyringe'

interface Service {
  createFeed(fk_follower_id: string, post_id: string): Promise<void>
}

@injectable()
@singleton()
export class FeedService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly followService: FollowService,
  ) {}
  public async createFeed(fk_follower_id: string, post_id: string): Promise<void> {
    const followings = await this.followService.getFollowings(fk_follower_id)
    const followingIds = followings.map((user) => user.id)
    for (const userId of followingIds) {
      await this.db.feed.create({
        data: {
          fk_user_id: userId,
          fk_post_id: post_id,
        },
      })
    }
  }
}
