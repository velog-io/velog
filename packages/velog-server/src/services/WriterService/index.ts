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
  public async getTrendingWriters(page?: number, take?: number): Promise<TrendingWritersResult> {
    if (!page || !take) {
      throw new BadRequestError()
    }

    if (take > 100) {
      throw new BadRequestError('Max take is 100')
    }

    if (page < 0 || take < 0) {
      throw new BadRequestError('Invalid input, input must be a non-negative number')
    }

    const key = this.redis.generateKey.recommendedFollowingsKey()
    const writers = await this.redis.get(key)

    if (!writers) {
      return {
        totalPage: 0,
        writers: [],
      }
    }

    const trendingWriters: TrendingWriter[] = JSON.parse(writers)

    const offset = (page - 1) * take
    const totalPage = Math.ceil(trendingWriters.length / take)

    const result = {
      totalPage,
      writers: trendingWriters.slice(offset, offset + take),
    }

    return result
  }
}
