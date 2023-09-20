import { JobProgressManager } from '@jobs/index.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { injectable, singleton } from 'tsyringe'

@singleton()
@injectable()
export class FeedJob extends JobProgressManager {
  constructor(private readonly redis: RedisService) {
    super()
  }
  public async createFeedJob() {
    console.log('Create Feed Job start...')

    const queue = []
    const queueName = this.redis.getQueueName('feed')

    let start = 0
    const chunk = 1000
    while (true) {
      const len = await this.redis.llen(queueName)
      console.log('len', len)
      if (len === 0) {
        break
      }

      const data = await this.redis.lrange(queueName, start * chunk, (start + 1) * chunk)

      if (data) {
        console.log('data', typeof data)
        console.log('data', data)
        queue.push(data)
      }

      start += 1
      console.log('start', start)
    }

    console.log(queue.flat().length)
  }
}
