import Redis from 'ioredis'
import { inject, injectable, singleton } from 'tsyringe'

interface Service {
  get generateKey(): GenerateRedisKey
  get queueName(): Record<QueueName, string>
}

@injectable()
@singleton()
export class RedisService extends Redis implements Service {
  private redisHost: string = ''
  constructor(@inject('RedisHost') redisHost: string) {
    super({ port: 6379, host: redisHost })
    this.redisHost = redisHost
  }

  async connection(): Promise<string> {
    return new Promise((resolve) => {
      this.connect(() => {
        resolve(`Redis connection established to ${this.redisHost}`)
      })
    })
  }

  get generateKey(): GenerateRedisKey {
    return {
      recommendedPostKey: (postId: string) => `${postId}:recommend`,
      postCacheKey: (username: string, postUrlSlug: string) => `ssr:/@${username}/${postUrlSlug}`,
      userCacheKey: (username: string) => `ssr:/@${username}`,
      postSeriesKey: (username: string, seriesUrlSlug: string) =>
        `ssr:/@${username}/series/${seriesUrlSlug}`,
      changeEmailKey: (code: string) => `changeEmailCode:${code}`,
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
  recommendedPostKey: (postId: string) => string
  postCacheKey: (username: string, postUrlSlug: string) => string
  userCacheKey: (username: string) => string
  postSeriesKey: (username: string, seriesUrlSlug: string) => string
  changeEmailKey: (code: string) => string
  trendingWriters: () => string
}

type QueueName = 'feed'
