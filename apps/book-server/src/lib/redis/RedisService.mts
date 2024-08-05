import { injectable, singleton } from 'tsyringe'
import { RedisService as Redis } from '@packages/database/velog-redis'
import { ENV } from '@env'

interface Service {}

@injectable()
@singleton()
export class RedisService extends Redis implements Service {
  constructor() {
    super({ port: ENV.redisPort, host: ENV.redisHost })
  }
}
