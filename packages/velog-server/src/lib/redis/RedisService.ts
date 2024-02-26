import { ENV } from '@env'
import Redis from 'ioredis'
import { injectable, singleton } from 'tsyringe'

interface Service {
  connection(): Promise<string>
  get generateKey(): GenerateRedisKey
  get queueName(): Record<QueueName, string>
  get setName(): Record<SetName, string>
  createFeedQueue(data: CreateFeedArgs): Promise<number>
}

@injectable()
@singleton()
export class RedisService extends Redis implements Service {
  constructor() {
    super({ port: ENV.redisPort, host: ENV.redisHost })
  }

  public async connection(): Promise<string> {
    return new Promise((resolve) => {
      this.connect(() => {
        resolve(`Redis connection established to ${ENV.redisHost}`)
      })
    })
  }

  public get generateKey(): GenerateRedisKey {
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

  public get queueName(): Record<QueueName, string> {
    return {
      feed: 'queue:feed',
    }
  }

  public get setName(): Record<SetName, string> {
    return {
      blockList: 'set:blockList',
    }
  }

  public async createFeedQueue(data: CreateFeedArgs): Promise<number> {
    const queueName = this.queueName.feed
    return await this.lpush(queueName, JSON.stringify(data))
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

type SetName = 'blockList'

type CreateFeedArgs = {
  fk_following_id: string
  fk_post_id: string
}
