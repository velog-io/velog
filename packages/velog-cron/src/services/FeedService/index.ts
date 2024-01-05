import { DbService } from '@lib/db/DbService.js'
import { FollowUserService } from '@services/FollowUserService/index.js'

import { injectable, singleton } from 'tsyringe'

interface Service {
  createFeed({ followingId, postId }: CreateFeedArgs): Promise<void>
}

@injectable()
@singleton()
export class FeedService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly followUserService: FollowUserService,
  ) {}
  public async createFeed({ followingId, postId }: CreateFeedArgs): Promise<void> {
    const followers = await this.followUserService.getFollowers(followingId)
    const followerIds = followers.map((user) => user.id)
    for (const userId of followerIds) {
      try {
        await this.db.feed.create({
          data: {
            fk_user_id: userId,
            fk_post_id: postId,
          },
        })
      } catch (_) {}
    }
  }
  public async deleteFeed() {
    return await this.db.feed.deleteMany({
      where: {
        is_deleted: true,
      },
    })
  }
}

type CreateFeedArgs = {
  followingId: string
  postId: string
}
