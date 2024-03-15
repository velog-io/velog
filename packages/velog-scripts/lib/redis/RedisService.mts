import { injectable, singleton } from 'tsyringe'
import Redis from 'ioredis'
import { ENV } from '../../env/env.mjs'

interface Service {}

@injectable()
@singleton()
export class RedisService extends Redis implements Service {
  constructor() {
    super({ port: 6379, host: ENV.redisHost })
  }

  async connection(): Promise<string> {
    return new Promise((resolve) => {
      this.connect(() => {
        resolve(`Redis connection established to ${ENV.redisHost}`)
      })
    })
  }
}
