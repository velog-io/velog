import { injectable, singleton } from 'tsyringe'
import Redis from 'ioredis'
import { ENV } from '@env'
import { RedisQueueName } from '@lib/redis/RedisInterface'

@injectable()
@singleton()
export class RedisService extends Redis {
  constructor() {
    super({ host: ENV.redisHost, port: 6379 })
  }

  async connection(): Promise<string> {
    return new Promise((resolve) => {
      this.connect(() => {
        resolve(`Redis connection established to ${ENV.redisHost}`)
      })
    })
  }

  getQueueName(name: RedisQueueName) {
    const mapper = {
      feed: 'feedQueue',
    }
    return mapper[name]
  }
}
