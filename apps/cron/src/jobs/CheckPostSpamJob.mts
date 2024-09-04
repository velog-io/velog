import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress.mjs'
import { PostService } from '@services/PostService/index.mjs'
import { type CheckPostSpamQueueData, RedisService } from '@lib/redis/RedisService.mjs'
import { DiscordService } from '@lib/discord/DiscordService.mjs'

@injectable()
@singleton()
export class CheckPostSpamJob extends JobProgress implements Job {
  constructor(
    private readonly redis: RedisService,
    private readonly discord: DiscordService,
    private readonly postService: PostService,
  ) {
    super()
  }
  public async runner(): Promise<void> {
    console.log('PostSpamCheckJob start...')
    console.time('PostSpamCheckJob')

    const spamQueueName = this.redis.queueName.checkPostSpam
    let handledQueueCount = 0
    while (true) {
      const item = await this.redis.lindex(spamQueueName, 0)
      if (!item) break
      const data: CheckPostSpamQueueData = JSON.parse(item)
      try {
        await this.postService.checkSpam(data)
      } catch (error) {
        console.log('PostSpamCheckJob error', error)
        const message = { message: 'PostSpamCheckJob error', payload: item, error: error }
        this.discord.sendMessage('error', JSON.stringify(message))
      } finally {
        await this.redis.lpop(spamQueueName)
        handledQueueCount++
      }
    }

    console.log(`handled Queue count: ${handledQueueCount}`)
    console.timeEnd('PostSpamCheckJob')
  }
}
