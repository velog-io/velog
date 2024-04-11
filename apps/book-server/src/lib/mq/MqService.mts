import { injectable, singleton } from 'tsyringe'
import MQEmitterRedis, { MQEmitterOptions } from 'mqemitter-redis'
import { RedisOptions } from 'ioredis'

export type MqOptions = {
  host: string
  port: number
}

export type Emitter = MQEmitterRedis.MQEmitterRedis

@injectable()
@singleton()
export class MqService {
  public emitter!: Emitter
  port: number
  host: string
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

  generateTopic<T extends TopicType>(type: T) {
    const map: TopicMap = {
      build: {
        completed: (bookId: string) => `BOOK_BUILD:completed:${bookId}`,
        installed: (bookId: string) => `BOOK_BUILD:installed:${bookId}`,
      },
      deploy: {
        completed: (bookId: string) => `BOOK_DEPLOY:completed:${bookId}`,
      },
    }
    return map[type] as TopicMap[T]
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
