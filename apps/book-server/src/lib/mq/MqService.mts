import { injectable, singleton } from 'tsyringe'
import { RedisService } from '@packages/database/velog-redis'

type MqServerOptions = {
  port: number
  host: string
}

@injectable()
@singleton()
export class MqService extends RedisService {
  constructor({ port, host }: MqServerOptions) {
    super({ port, host })
  }
}
