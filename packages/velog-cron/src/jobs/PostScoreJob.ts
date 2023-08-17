import { DbService } from '@lib/db/DbService.js'
import PostService from '@services/PostService.js'
import { injectable, singleton } from 'tsyringe'
import { startOfDay, endOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

@singleton()
@injectable()
export class PostScoreJob {
  constructor(private readonly postService: PostService, private readonly db: DbService) {}
  private isRunning = false
  public get isRun() {
    return this.isRunning
  }
  public startPostScoreJob() {
    this.isRunning = true
  }
  public stopPostScoreJob() {
    this.isRunning = false
  }
  public async scoreCalculation() {
    const utcTime = new Date()
    const timezone = 'Asia/Seoul'
    const tz = utcToZonedTime(utcTime, timezone)
    const start = startOfDay(tz) // 오늘 날짜의 시작 시간 (KST)
    const end = endOfDay(tz) // 오늘 날짜의 끝 시간 (KST)

    const posts = await this.db.post.findMany({
      where: {
        is_private: false,
        likes: {
          gte: 1,
        },
        score: 10,
        released_at: {
          gte: start,
          lte: end,
        },
      },
      select: {
        id: true,
      },
    })

    const queue: string[][] = []

    let tick: string[] = []
    const tickSize = 200

    for (let post of posts) {
      tick.push(post.id)
      if (tick.length === tickSize) {
        queue.push(tick)
        tick = []
      }
    }

    for (let i = 0; i < queue.length; i++) {
      const postIds = queue[i]
      for (let postId of postIds) {
        await this.postService.scoreCarculator(postId)
      }
    }
  }
}
