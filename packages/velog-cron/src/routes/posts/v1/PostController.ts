import { ENV } from '@env'
import { startOfDay, subMonths } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { injectable, singleton } from 'tsyringe'
import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { DbService } from '@lib/db/DbService.js'
import { RedisService } from '@lib/redis/RedisService.js'
import PostService from '@services/PostService/index.js'

interface Controller {
  updateScoreByPostId(postId: string): Promise<void>
  bulkUpdateScore(): Promise<number>
}

@singleton()
@injectable()
export class PostController implements Controller {
  constructor(
    private readonly postService: PostService,
    private readonly db: DbService,
    private readonly redis: RedisService,
  ) {}
  async updateScoreByPostId(postId: string): Promise<void> {
    const post = await this.postService.findById(postId)

    if (!post) {
      throw new NotFoundError('Not found Post')
    }

    await this.postService.scoreCarculator(post.id)
  }
  async bulkUpdateScore(): Promise<number> {
    if (ENV.appEnv !== 'development') {
      throw new BadRequestError('This operation is only allowed in development environment.')
    }

    const utcTime = new Date()
    const timezone = 'Asia/Seoul'
    const tz = utcToZonedTime(utcTime, timezone)
    const startOfToday = startOfDay(tz)
    const threeMonthsAgo = subMonths(startOfToday, 3)

    const posts = await this.db.post.findMany({
      where: {
        is_private: false,
        likes: {
          gte: 1,
        },
        released_at: {
          gte: threeMonthsAgo,
        },
      },
      select: {
        id: true,
      },
    })

    // for (let i = 0; i < 10000; i++) {
    //   if (i % 1000 === 0) {
    //     console.log(`${i} / 10000`)
    //   }

    //   const queueName = this.redis.getQueueName('feed')
    //   const queueInfo = {
    //     user_id: '6028c07a-f117-45a8-8168-f6c8aa43f9e0',
    //     post_id: '7f02e7f2-747c-425d-96f8-2fbd66dc7cf4',
    //   }
    //   this.redis.lpush(queueName, JSON.stringify(queueInfo))
    // }

    const queueName = this.redis.getQueueName('feed')
    const data = await this.redis.rpop(queueName)
    const rest = await this.redis.llen(queueName)
    if (data) {
      console.log('data', data)
      console.log('rest', rest)
    }

    const queue: string[][] = []
    let tick: string[] = []
    const tickSize = 200

    for (const post of posts) {
      tick.push(post.id)
      if (tick.length === tickSize) {
        queue.push(tick)
        tick = []
      }
    }

    if (tick.length > 0) {
      queue.push(tick)
    }

    for (let i = 0; i < queue.length; i++) {
      const postIds = queue[i]
      console.log(`${i + 1} / ${queue.length}`)
      for (const postId of postIds) {
        await this.postService.scoreCarculator(postId)
      }
    }

    return posts.length
  }
}
