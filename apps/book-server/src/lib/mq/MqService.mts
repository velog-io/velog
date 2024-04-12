import { injectable, singleton } from 'tsyringe'
import MQEmitterRedis, { MQEmitterOptions } from 'mqemitter-redis'
import { RedisOptions } from 'ioredis'
import { PubSub } from 'mercurius'
import { SubscriptionResolvers } from '@graphql/generated.js'

export type MqOptions = {
  host: string
  port: number
}

type PayloadKey = keyof SubscriptionResolvers

export type Emitter = MQEmitterRedis.MQEmitterRedis

@injectable()
@singleton()
export class MqService {
  public emitter!: Emitter
  private port: number
  private host: string
  constructor({ host, port }: MqOptions) {
    this.host = host
    this.port = port
    if (!this.emitter) {
      this.init()
    }
  }
  private init() {
    const options: MQEmitterOptions & RedisOptions = {
      port: 6379,
      host: this.host,
      separator: ':',
    }
    const emitter: Emitter = (MQEmitterRedis as any)(options)
    this.emitter = emitter
  }

  public topicGenerator<T extends keyof SubscriptionResolvers>(type: T): Function {
    const map: { [K in keyof SubscriptionResolvers]: (args: any) => string } = {
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

type TopicType = 'build' | 'deploy'
interface TopicMap extends Record<TopicType, BuildType | DeployType> {
  build: BuildType
  deploy: DeployType
}

type BuildType = {
  completed: (bookId: string) => string
  installed: (bookId: string) => string
}

type DeployType = {
  completed: (bookId: string) => string
}

type PublishArgs = {
  topicParameter: string
  payload: { [K in keyof SubscriptionResolvers]: { message: any } & { [T: string]: any } }
}
