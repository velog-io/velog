import { ENV } from '@env'
import Redis from 'ioredis'
import { injectable, singleton } from 'tsyringe'

interface Service {
  connection(): Promise<string>
  get generateKey(): GenerateRedisKey
  get queueName(): Record<QueueName, string>
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
      createFeed: 'queue:feed',
      spamCheck: 'queue:postIdsForSpamCheck',
    }
  }

  public async createFeedQueue(data: CreateFeedArgs): Promise<number> {
    const queueName = this.queueName.createFeed
    return await this.lpush(queueName, JSON.stringify(data))
  }

  public async addToSpamCheckQueue(data: SpamCheckArgs): Promise<number> {
    const queueName = this.queueName.spamCheck
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

type QueueName = 'createFeed' | 'spamCheck'

export type ChangeEmailArgs = {
  email: string
  userId: string
}

export type CreateFeedArgs = {
  fk_following_id: string
  fk_post_id: string
}

export type SpamCheckArgs = {
  post_id: string
  user_id: string
  ip: string
}
