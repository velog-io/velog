import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { WriterService } from '@services/WriterService/index.js'

@singleton()
@injectable()
export class GenerateTrendingWritersJob extends JobProgress implements Job {
  constructor(
    private readonly redis: RedisService,
    private readonly writerService: WriterService,
  ) {
    super()
  }
  public async runner(): Promise<void> {
    console.log('Generate Trending Writers job start...')
    console.time('generate Trending Writers')

    const writers = await this.writerService.generateTrendingWriters()

    const json = JSON.stringify(writers)
    const key = this.redis.generateKey.trendingWriters()
    this.redis.set(key, json)

    console.timeEnd('generate Trending Writers')
    console.log('Generated writers count:', writers.length)
  }
}
