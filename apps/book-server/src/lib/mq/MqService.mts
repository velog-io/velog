import { injectable, singleton } from 'tsyringe'
import redis, { MQEmitterRedis } from 'mqemitter-redis'
import { EnvService } from '@lib/env/EnvService.mjs'

@injectable()
@singleton()
export class MqService {
  public emitter!: MQEmitterRedis
  constructor(private readonly envService: EnvService) {
    if (!this.emitter) {
      this.init()
    }
  }

  private init() {
    const emitter = redis.default({
      port: 6379,
      host: this.envService.get('redisHost'),
    })
    this.emitter = emitter
  }
}
