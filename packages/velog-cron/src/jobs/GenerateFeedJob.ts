import { Job, JobProgress } from '@jobs/JobProgress.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { FeedService } from '@services/FeedService/index.js'
import { injectable, singleton } from 'tsyringe'

@singleton()
@injectable()
export class GenerateFeedJob extends JobProgress implements Job {
  constructor(
    private readonly redis: RedisService,
    private readonly feedService: FeedService,
  ) {
    super()
  }
  public async runner() {
    console.log('Create feed job start...')
    console.time('create feed')

    const feedQueueName = this.redis.queueName.createFeed
    let handledQueueCount = 0
    while (true) {
      const item = await this.redis.lindex(feedQueueName, 0)
      if (!item) break
      const data: FeedQueueData = JSON.parse(item)
      const { fk_following_id, fk_post_id } = data
      try {
        await this.feedService.createFeed({ followingId: fk_following_id, postId: fk_post_id })
        await this.redis.lpop(feedQueueName)
        handledQueueCount++
      } catch (error) {
        console.log('Error occurred while creating feed', error)
        console.log('data', data)
        continue
      }
    }
    console.log(`Created Feed Count: ${handledQueueCount}`)
    console.timeEnd('create feed')
  }
}

type FeedQueueData = {
  fk_following_id: string
  fk_post_id: string
}
