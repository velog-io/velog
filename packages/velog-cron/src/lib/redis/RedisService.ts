import { injectable, singleton } from 'tsyringe'
import Redis from 'ioredis'
import { ENV } from '@env'

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

  get generateKey(): GenerateRedisKey {
    return {
      recommendedFollowingsKey: () => `recommended:followings`,
    }
  }

  get queueName() {
    return {
      feed: 'feedQueue',
    }
  }
}

type GenerateRedisKey = {
  recommendedFollowingsKey: () => string
}
