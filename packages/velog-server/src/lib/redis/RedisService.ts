import { ENV } from '@env'
import Redis from 'ioredis'
import { injectable, singleton } from 'tsyringe'

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
      recommendedPost: (postId: string) => `${postId}:recommend`,
      postCache: (username: string, postUrlSlug: string) => `ssr:/@${username}/${postUrlSlug}`,
      userCache: (username: string) => `ssr:/@${username}`,
      postSeries: (username: string, seriesUrlSlug: string) =>
        `ssr:/@${username}/series/${seriesUrlSlug}`,
      changeEmail: (code: string) => `changeEmailCode:${code}`,
      trendingWriters: () => `trending:writers`,
    }
  }

  get queueName(): Record<QueueName, string> {
    return {
      feed: 'queue:feed',
    }
  }
}

type GenerateRedisKey = {
  recommendedPost: (postId: string) => string
  postCache: (username: string, postUrlSlug: string) => string
  userCache: (username: string) => string
  postSeries: (username: string, seriesUrlSlug: string) => string
  changeEmail: (code: string) => string
  trendingWriters: () => string
}

type QueueName = 'feed'
