import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress'
import { RedisService } from '@lib/redis/RedisService'

@singleton()
@injectable()
export class RecommendFollowerJob extends JobProgress implements Job {
  constructor(private readonly redis: RedisService) {
    super()
  }
  public runner(): Promise<void> {
    console.log('Recommend Follower job start...')
    console.time('recommend Follower')

    console.timeEnd('recommend Follower')
  }
}
