import { BadRequestError } from '@errors/BadRequestErrors.js'
import { TrendingWriter, TrendingWritersResult } from '@graphql/generated'
import { RedisService } from '@lib/redis/RedisService.js'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getTrendingWriters(page?: number, take?: number): Promise<TrendingWritersResult>
}

@injectable()
@singleton()
export class WriterService implements Service {
  constructor(private readonly redis: RedisService) {}
  public async getTrendingWriters(
    cursor: number = 0,
    take: number = 20,
  ): Promise<TrendingWritersResult> {
    if (take > 100) {
      throw new BadRequestError('Max take is 100')
    }

    if (cursor < 0 || take < 0) {
      throw new BadRequestError('Invalid input, input must be a non-negative number')
    }

    const key = this.redis.generateKey.trendingWriters()
    const writers = await this.redis.get(key)

    if (!writers) {
      return {
        writers: [],
      }
    }

    const trendingWriters: TrendingWriter[] = JSON.parse(writers)
    return {
      writers: trendingWriters.filter(
        (writer) => writer.index >= cursor && writer.index < cursor + take,
      ),
    }
  }
}
