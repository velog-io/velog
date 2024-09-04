import Redis from 'ioredis'

interface Service {
  connection(): Promise<void>
  get generateKey(): GenerateRedisKey
  get queueName(): Record<QueueName, string>
  addToCreateFeedQueue(data: CreateFeedQueueData): Promise<number>
  addToCheckPostSpamQueue(data: CheckPostSpamQueueData): Promise<number>
  addToScorePostQueue(data: ScorePostQueueData): Promise<number>
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
      existsWriter: (userId: string) => `exists:writer:${userId}`,
      errorMessageCache: (type: string, userId: string) => `error:${type}:${userId}`,
      buildBook: (bookId: string) => `book:build:${bookId}`,
      deployBook: (bookId: string) => `book:deploy:${bookId}`,
    }
  }

  public get queueName(): Record<QueueName, string> {
    return {
      createFeed: 'queue:feed',
      checkPostSpam: 'queue:checkPostSpam',
      scorePost: 'queue:scorePost',
    }
  }

  public addToCreateFeedQueue(data: CreateFeedQueueData) {
    const queueName = this.queueName.createFeed
    return this.lpush(queueName, JSON.stringify(data))
  }

  public addToCheckPostSpamQueue(data: CheckPostSpamQueueData): Promise<number> {
    const queueName = this.queueName.checkPostSpam
    return this.lpush(queueName, JSON.stringify(data))
  }

  public addToScorePostQueue(data: ScorePostQueueData): Promise<number> {
    const queueName = this.queueName.scorePost
    return this.lpush(queueName, JSON.stringify(data))
  }
}

type GenerateRedisKey = {
  recommendedPost: (postId: string) => string
  postCache: (username: string, postUrlSlug: string) => string
  userCache: (username: string) => string
  postSeries: (username: string, seriesUrlSlug: string) => string
  changeEmail: (code: string) => string
  trendingWriters: () => string
  existsUser: (userId: string) => string
  existsWriter: (userId: string) => string
  errorMessageCache: (type: string, userId: string) => string
  buildBook: (bookId: string) => string
  deployBook: (bookId: string) => string
}

type QueueName = 'createFeed' | 'checkPostSpam' | 'scorePost'

export type ChangeEmailArgs = {
  email: string
  userId: string
}

export type CreateFeedQueueData = {
  fk_following_id: string
  fk_post_id: string
}

export type CheckPostSpamQueueData = {
  post_id: string
  user_id: string
  ip: string
}

export type ScorePostQueueData = {
  post_id: string
}
