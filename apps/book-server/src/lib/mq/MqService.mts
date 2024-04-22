import { injectable, singleton } from 'tsyringe'
import MQEmitterRedis, { MQEmitterOptions } from 'mqemitter-redis'
import { RedisOptions } from 'ioredis'
import { SubscriptionResolvers } from '@graphql/generated.js'
import { ENV } from '@env'

export type MqOptions = {
  host: string
  port: number
}

export type Emitter = MQEmitterRedis.MQEmitterRedis

@injectable()
@singleton()
export class MqService {
  public emitter!: Emitter
  constructor() {
    if (!this.emitter) {
      this.init()
    }
  }
  private init() {
    const options: MQEmitterOptions & RedisOptions = {
      port: ENV.redisPort,
      host: ENV.redisHost,
      separator: ':',
    }
    const emitter: Emitter = (MQEmitterRedis as any)(options)
    this.emitter = emitter
  }

  public topicGenerator<T extends SubscriptionResolverKey>(type: T): (args: any) => string {
    const map: TopicMap = {
      bookBuildCompleted: (bookId: string) => `BOOK_BUILD:completed:${bookId}`,
      bookBuildInstalled: (bookId: string) => `BOOK_BUILD:installed:${bookId}`,
      bookDeployCompleted: (bookId: string) => `BOOK_DEPLOY:completed:${bookId}`,
    }
    const generator = map[type]
    if (!generator) {
      throw new Error('No topic generator found for type')
    }
    return generator
  }

  public async publish({ topicParameter, payload }: PublishArgs) {
    const key = Object.keys(payload)[0] as keyof SubscriptionResolvers
    const generator = this.topicGenerator(key)
    const topic = generator(topicParameter)
    this.emitter.emit({ topic, payload })
  }
}

type SubscriptionResolverKey = keyof SubscriptionResolvers
type Payload = {
  [K in SubscriptionResolverKey]?: { message: string }
}
type TopicMap = {
  [K in SubscriptionResolverKey]: (args: any) => string
}

type PublishArgs = {
  topicParameter: string
  payload: Payload
}
