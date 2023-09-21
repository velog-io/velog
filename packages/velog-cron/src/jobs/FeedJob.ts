import { JobProgress } from '@jobs/JobProgress.js'
import { DbService } from '@lib/db/DbService.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { User } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

@singleton()
@injectable()
export class FeedJob extends JobProgress {
  constructor(
    private readonly redis: RedisService,
    private readonly db: DbService,
  ) {
    super()
  }
  public async handleFeed() {
    console.log('Create Feed Job start...')

    console.time('create Feed')
    const queueName = this.redis.getQueueName('feed')
    let handledQueueCount = 0
    while (true) {
      const item = await this.redis.lindex(queueName, 0)
      if (!item) break
      const data = JSON.parse(item) as FeedData
      await this.createFeed(data)
      await this.redis.lpop(queueName)
      handledQueueCount++
    }
    console.timeEnd('create Feed')
    console.log(`Create Feed Count: ${handledQueueCount}`)
  }
  private async createFeed({ writer_id, post_id }: CreateFeedParameter): Promise<void> {
    const followings = await this.getFollowings(writer_id)
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
  private async getFollowings(writer_id: string): Promise<User[]> {
    const followUser = await this.db.followUser.findMany({
      where: {
        fk_follow_user_id: writer_id,
      },
      select: {
        following: true,
      },
    })
    const followings = followUser.map((follow) => follow.following)
    return followings
  }
}

type FeedData = {
  writer_id: string
  post_id: string
}

type CreateFeedParameter = FeedData
