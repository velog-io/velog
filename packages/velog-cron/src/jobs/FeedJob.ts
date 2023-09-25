import { Job, JobProgress } from '@jobs/JobProgress.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { FeedService } from '@services/FeedService/index.js'
import { injectable, singleton } from 'tsyringe'

@singleton()
@injectable()
export class FeedJob extends JobProgress implements Job {
  constructor(
    private readonly redis: RedisService,
    private readonly feedService: FeedService,
  ) {
    super()
  }
  public async run() {
    console.log('Create Feed Job start...')
    console.time('create Feed')

    const queueName = this.redis.getQueueName('feed')
    let handledQueueCount = 0
    while (true) {
      const item = await this.redis.lindex(queueName, 0)
      if (!item) break
      const data = JSON.parse(item) as FeedData
      const { fk_follower_id, fk_post_id } = data
      await this.feedService.createFeed(fk_follower_id, fk_post_id)
      await this.redis.lpop(queueName)
      handledQueueCount++
    }
    console.timeEnd('create Feed')
    console.log(`Create Feed Count: ${handledQueueCount}`)
  }
}

type FeedData = {
  fk_follower_id: string
  fk_post_id: string
}
