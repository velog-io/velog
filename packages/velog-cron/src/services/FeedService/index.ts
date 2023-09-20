import { RedisService } from '@lib/redis/RedisService'
import { injectable, singleton } from 'tsyringe'

interface Service {}

@injectable()
@singleton()
export class FeedService implements Service {
  constructor(private readonly redis: RedisService) {}
  private async createFeed(writer_user_id: string, post_id: string): Promise<void> {}
}
