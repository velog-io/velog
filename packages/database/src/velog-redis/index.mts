import Redis from 'ioredis'

interface Service {
  connection(): Promise<void>
  get generateKey(): GenerateRedisKey
  get queueName(): Record<QueueName, string>
  createFeedQueue(data: CreateFeedArgs): Promise<number>
}

type RedisOptions = {
  port: number
  host: string
}

export class RedisService extends Redis.default implements Service {
  host: string
  port: number
  constructor({ port, host }: RedisOptions) {
    if (!port) throw new Error('redis port is required')
    if (!host) throw new Error('redis host is required')
    super({ port: port, host })
    this.host = host
    this.port = port
  }

  public async connection(): Promise<void> {
    return new Promise((resolve) => {
      super.connect(() => {
        resolve()
        console.info(`INFO: Redis connected to "${this.host}:${this.port}"`)
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
      existsUser: (userId: string) => `exists:user:${userId}`,
      errorMessageCache: (type: string, userId: string) => `error:${type}:${userId}`,
    }
  }

  public get queueName(): Record<QueueName, string> {
    return {
      createFeed: 'queue:feed',
      checkPostSpam: 'queue:checkPostSpam',
    }
  }

  public async createFeedQueue(data: CreateFeedArgs): Promise<number> {
    const queueName = this.queueName.createFeed
    return await this.lpush(queueName, JSON.stringify(data))
  }

  public async addToSpamCheckQueue(data: CheckPostSpamArgs): Promise<number> {
    const queueName = this.queueName.checkPostSpam
    return await this.lpush(queueName, JSON.stringify(data))
  }
}

type GenerateRedisKey = {
  recommendedPost: (postId: string) => string
  postCache: (username: string, postUrlSlug: string) => string
  userCache: (username: string) => string
  postSeries: (username: string, seriesUrlSlug: string) => string
  changeEmail: (code: string) => string
  existsUser: (userId: string) => string
  errorMessageCache: (type: string, userId: string) => string
  trendingWriters: () => string
}

type QueueName = 'createFeed' | 'checkPostSpam'

export type ChangeEmailArgs = {
  email: string
  userId: string
}

export type CreateFeedArgs = {
  fk_following_id: string
  fk_post_id: string
}

export type CheckPostSpamArgs = {
  post_id: string
  user_id: string
  ip: string
}
