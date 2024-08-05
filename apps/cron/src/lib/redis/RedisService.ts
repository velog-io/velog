import { injectable, singleton } from 'tsyringe'
import { ENV } from '@env'
import { RedisService as Redis } from '@packages/database/velog-redis'
export type { ChangeEmailArgs } from '@packages/database/velog-redis'
export type { CheckPostSpamArgs } from '@packages/database/velog-redis'
export type { CreateFeedArgs } from '@packages/database/velog-redis'

@injectable()
@singleton()
export class RedisService extends Redis {
  constructor() {
    super({ port: ENV.redisPort, host: ENV.redisHost })
  }
}
