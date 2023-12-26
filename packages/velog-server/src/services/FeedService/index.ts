import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { subWeeks } from 'date-fns'
import { injectable, singleton } from 'tsyringe'

interface Service {
  createFeedByFollow(args: CreateFeedByFollowArgs): Promise<void>
  removeFeedByUnfollow(args: RemoveFeedByFollowArgs): Promise<void>
}

@injectable()
@singleton()
export class FeedService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  async createFeedByFollow({ followingUserId, followerUserId }: CreateFeedByFollowArgs) {
    // 2주 동안 만들어진 post를 새롭게 Feed로 생성함
    console.log('followingUserId', followingUserId)
    const posts = await this.db.post.findMany({
      where: {
        fk_user_id: followingUserId,
        created_at: {
          gte: subWeeks(this.utils.now, 2),
        },
      },
    })

    console.log('posts', posts)

    const data = posts.map(({ id }) => ({ fk_post_id: id, fk_user_id: followerUserId }))

    await this.db.feed.createMany({
      data,
      skipDuplicates: true,
    })
  }
  async removeFeedByUnfollow({}: RemoveFeedByFollowArgs): Promise<void> {}
}

type CreateFeedByFollowArgs = {
  followingUserId: string
  followerUserId: string
}

type RemoveFeedByFollowArgs = CreateFeedByFollowArgs
