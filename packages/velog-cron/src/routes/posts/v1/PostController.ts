import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { DbService } from '@lib/db/DbService.js'
import { PostService } from '@services/PostService/index.js'
import { injectable, singleton } from 'tsyringe'
import { utcToZonedTime } from 'date-fns-tz'
import { startOfDay, subMonths } from 'date-fns'
import { ENV } from '@env'

interface Controller {
  updatePostScore(postId: string): Promise<void>
  calculateRecentPostScore(): Promise<number>
}

@singleton()
@injectable()
export class PostController implements Controller {
  constructor(
    private readonly db: DbService,
    private readonly postService: PostService,
  ) {}
  async updatePostScore(postId: string): Promise<void> {
    const post = await this.postService.findById(postId)

    if (!post) {
      throw new NotFoundError('Not found Post')
    }

    await this.postService.scoreCarculator(post.id)
  }
  async calculateRecentPostScore(): Promise<number> {
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

    for (let i = 0; i < posts.length; i++) {
      console.log(`${i} / ${posts.length}`)
      const postId = posts[i].id
      await this.postService.scoreCarculator(postId)
    }

    return posts.length
  }
}
