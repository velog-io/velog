import { DbService } from '@lib/db/DbService.js'
import { FollowService } from '@services/FollowService/index.js'

import { injectable, singleton } from 'tsyringe'

interface Service {
  createFeed({ followingId, postId }: CreateFeedArgs): Promise<void>
}

@injectable()
@singleton()
export class FeedService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly followService: FollowService,
  ) {}
  public async createFeed({ followingId, postId }: CreateFeedArgs): Promise<void> {
    const followers = await this.followService.getFollowers(followingId)
    const followerIds = followers.map((user) => user.id)
    for (const userId of followerIds) {
      await this.db.feed.create({
        data: {
          fk_user_id: userId,
          fk_post_id: postId,
        },
      })
    }
  }
}

type CreateFeedArgs = {
  followingId: string
  postId: string
}
