import { injectable, singleton } from 'tsyringe'
import { ENV } from '@env'
import { RedisService as Redis } from '@packages/database/velog-redis'
export type {
  ChangeEmailArgs,
  CheckPostSpamQueueData,
  CreateFeedQueueData,
} from '@packages/database/velog-redis'

@injectable()
@singleton()
export class RedisService extends Redis {
  constructor() {
    super({ port: ENV.redisPort, host: ENV.redisHost })
  }
}
