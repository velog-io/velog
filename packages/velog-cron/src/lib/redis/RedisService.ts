import { injectable, singleton } from 'tsyringe'
import Redis from 'ioredis'
import { ENV } from '@env'

@injectable()
@singleton()
export class RedisService extends Redis {
  constructor() {
    super({ host: ENV.redisHost, port: 6379 })
  }
}
