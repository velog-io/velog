import { ENV } from '../../env/env.mjs'
import Redis from 'ioredis'
import { injectable, singleton } from 'tsyringe'

interface Service {
  get generateKey(): GenerateRedisKey
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
      privatePosts: (now: string) => `privatePosts:${now}`,
    }
  }
}

type GenerateRedisKey = {
  privatePosts: (now: string) => string
}
