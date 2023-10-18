import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { FollowUserService } from '@services/FollowUserService/index.js'

@singleton()
@injectable()
export class RecommendFollowerJob extends JobProgress implements Job {
  constructor(
    private readonly redis: RedisService,
    private readonly followUserService: FollowUserService,
  ) {
    super()
  }
  public async runner(): Promise<void> {
    console.log('Recommend follower job start...')
    console.time('recommend Followers')

    const followers = await this.followUserService.createRecommendFollower()

    const json = JSON.stringify(followers)
    const redisKey = this.redis.generateKey.recommendedFollowersKey()
    this.redis.set(redisKey, json)

    console.timeEnd('recommend Followers')
  }
}
