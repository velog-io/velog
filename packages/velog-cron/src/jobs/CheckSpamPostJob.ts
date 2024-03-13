import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress.js'
import { PostService } from '@services/PostService/index.js'
import { CheckPostSpamArgs, RedisService } from '@lib/redis/RedisService.js'
import { DiscordService } from '@lib/discord/DiscordService.js'

@injectable()
@singleton()
export class CheckSpamPostJob extends JobProgress implements Job {
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
      const data: CheckPostSpamArgs = JSON.parse(item)
      try {
        await this.postService.checkSpam(data)
      } catch (error) {
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
