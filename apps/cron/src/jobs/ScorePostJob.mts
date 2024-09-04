import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress.mjs'
import { RedisService } from '@lib/redis/RedisService.mjs'
import { PostService } from '@services/PostService/index.mjs'
import { ScorePostQueueData } from '@packages/database/velog-redis'
import { DiscordService } from '@lib/discord/DiscordService.mjs'

@singleton()
@injectable()
export class ScorePostJob extends JobProgress implements Job {
  constructor(
    private readonly postService: PostService,
    private readonly redis: RedisService,
    private readonly discord: DiscordService,
  ) {
    super()
  }
  public async runner(): Promise<void> {
    console.log('ScorePostJob start...')
    console.time('ScorePostJob')

    const scorePostQueueName = this.redis.queueName.scorePost
    let handledQueueCount = 0

    while (true) {
      const item = await this.redis.lindex(scorePostQueueName, 0)
      if (!item) break
      const data: ScorePostQueueData = JSON.parse(item)
      try {
        await this.postService.scoreCalculator(data.post_id)
      } catch (error) {
        console.log('ScorePostJob error', error)
        const message = { message: 'ScorePostJob error', payload: item, error: error }
        this.discord.sendMessage('error', JSON.stringify(message))
      } finally {
        await this.redis.lpop(scorePostQueueName)
        handledQueueCount++
      }
    }

    console.log(`handled Queue count: ${handledQueueCount}`)
    console.timeEnd('ScorePostJob')
  }
}
