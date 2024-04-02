import { injectable, singleton } from 'tsyringe'
import MQEmitterRedis from 'mqemitter-redis'

type MqOptions = {
  host: string
  port: number
}

@injectable()
@singleton()
export class MqService {
  public emitter!: MQEmitterRedis.MQEmitterRedis
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
    const emitter = (MQEmitterRedis as any)({
      port: 6379,
      host: this.host,
    })
    this.emitter = emitter
  }
}
