import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { FollowService } from '@services/FollowService/index.js'

@singleton()
@injectable()
export class RecommendFollowingJob extends JobProgress implements Job {
  constructor(
    private readonly redis: RedisService,
    private readonly followService: FollowService,
  ) {
    super()
  }
  public async runner(): Promise<void> {
    console.log('Recommend follower job start...')
    console.time('recommend Followers')

    const followings = await this.followService.createRecommendFollowings()

    const json = JSON.stringify(followings)
    const key = this.redis.generateKey.recommendedFollowingsKey()
    this.redis.set(key, json)

    console.timeEnd('recommend Followers')
  }
}
