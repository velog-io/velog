import { BadRequestError } from '@errors/BadRequestErrors.js'
import { TrendingWriter } from '@graphql/generated'
import { RedisService } from '@lib/redis/RedisService.js'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getTrendingWriters(page?: number, take?: number): Promise<TrendingWriter[]>
}

@injectable()
@singleton()
export class WriterService implements Service {
  constructor(private readonly redis: RedisService) {}
  public async getTrendingWriters(
    cursor: number = 0,
    limit: number = 20,
  ): Promise<TrendingWriter[]> {
    if (limit > 100) {
      throw new BadRequestError('Max take is 100')
    }

    if (cursor < 0 || limit < 0) {
      throw new BadRequestError('Invalid input, input must be a non-negative number')
    }

    const key = this.redis.generateKey.trendingWriters()
    const writers = await this.redis.get(key)

    if (!writers) return []

    const trendingWriters: TrendingWriter[] = JSON.parse(writers)
    return trendingWriters.filter(
      (writer) => writer.index >= cursor && writer.index < cursor + limit,
    )
  }
}
