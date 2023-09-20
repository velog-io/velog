import { ENV } from '@env'
import { BadRequestError } from '@errors/BadRequestErrors'
import { NotFoundError } from '@errors/NotfoundError'
import { DbService } from '@lib/db/DbService'
import PostService from '@services/PostService'
import { startOfDay, subMonths } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { injectable, singleton } from 'tsyringe'

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
      console.log(`${i} / ${queue.length}`)
      for (const postId of postIds) {
        await this.postService.scoreCarculator(postId)
      }
    }

    return posts.length
  }
}
