import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress.mjs'
import { RedisService } from '@lib/redis/RedisService.mjs'
import { WriterService } from '@services/WriterService/index.mjs'

@singleton()
@injectable()
export class GenerateTrendingWritersJob extends JobProgress implements Job {
  constructor(private readonly redis: RedisService, private readonly writerService: WriterService) {
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
