import { injectable, singleton } from 'tsyringe'
import Redis from 'ioredis'
import { ENV } from 'src/env.mjs'

interface Service {
  get generateKey(): GenerateRedisKey
  get queueName(): Record<QueueName, string>
}

@injectable()
@singleton()
export class RedisService extends Redis.default implements Service {
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

  get queueName(): Record<QueueName, string> {
    return {
      createFeed: 'queue:feed',
      checkPostSpam: 'queue:checkPostSpam',
    }
  }
}

type GenerateRedisKey = {
  trendingWriters: () => string
}

type QueueName = 'createFeed' | 'checkPostSpam'

export type CheckPostSpamArgs = {
  post_id: string
  user_id: string
  ip: string
}
