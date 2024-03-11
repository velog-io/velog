import { injectable, singleton } from 'tsyringe'
import Redis from 'ioredis'
import { ENV } from '@env'

interface Service {
  get generateKey(): GenerateRedisKey
  get queueName(): Record<QueueName, string>
}

@injectable()
@singleton()
export class RedisService extends Redis implements Service {
  constructor() {
    super({ port: 6379, host: ENV.redisHost })
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
      trendingWriters: () => `trending:writers`,
    }
  }

  get queueName() {
    return {
      createFeed: 'queue:feed',
    }
  }
}

type GenerateRedisKey = {
  trendingWriters: () => string
}

type QueueName = 'createFeed'
