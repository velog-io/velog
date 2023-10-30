import Redis from 'ioredis'
import { injectable, singleton } from 'tsyringe'
import { ENV } from '@env'

interface Service {
  get generateKey(): GenerateRedisKey
}

@injectable()
@singleton()
export class RedisService extends Redis implements Service {
  constructor() {
    super({ port: 6379, host: ENV.redisHost })
  }
  get generateKey(): GenerateRedisKey {
    return {
      recommendedPostKey: (postId: string) => `${postId}:recommend`,
      postCacheKey: (username: string, postUrlSlug: string) => `ssr:/@${username}/${postUrlSlug}`,
      userCacheKey: (username: string) => `ssr:/@${username}`,
      postSeriesKey: (username: string, seriesUrlSlug: string) =>
        `ssr:/@${username}/series/${seriesUrlSlug}`,
      changeEmailKey: (code: string) => `changeEmailCode:${code}`,
      recommendedFollowingsKey: () => `recommended:followings`,
    }
  }
}

type GenerateRedisKey = {
  recommendedPostKey: (postId: string) => string
  postCacheKey: (username: string, postUrlSlug: string) => string
  userCacheKey: (username: string) => string
  postSeriesKey: (username: string, seriesUrlSlug: string) => string
  changeEmailKey: (code: string) => string
  recommendedFollowingsKey: () => string
}
