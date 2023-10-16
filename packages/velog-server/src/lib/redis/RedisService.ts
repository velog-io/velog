import Redis from 'ioredis'
import { injectable, singleton } from 'tsyringe'
import { GenerateCacheKey } from './RedisInterface.js'
import { ENV } from '@env'

interface Service {
  get generateKey(): GenerateCacheKey
}

@injectable()
@singleton()
export class RedisService extends Redis implements Service {
  constructor() {
    super({ port: 6379, host: ENV.redisHost })
  }
  get generateKey(): GenerateCacheKey {
    return {
      recommendedPostKey: (postId: string) => `${postId}:recommend`,
      postCacheKey: (username: string, postUrlSlug: string) => `ssr:/@${username}/${postUrlSlug}`,
      userCacheKey: (username: string) => `ssr:/@${username}`,
      postSeriesKey: (username: string, seriesUrlSlug: string) =>
        `ssr:/@${username}/series/${seriesUrlSlug}`,
      changeEmailKey: (code: string) => `changeEmailCode:${code}`,
    }
  }
}
