import { ENV } from '@env'
import { injectable, singleton } from 'tsyringe'
import { RedisService as Redis } from '@packages/database/velog-redis'
export { ChangeEmailArgs, CheckPostSpamArgs, CreateFeedArgs } from '@packages/database/velog-redis'

@injectable()
@singleton()
export class RedisService extends Redis {
  constructor() {
    super({ port: ENV.redisPort, host: ENV.redisHost })
  }
}
