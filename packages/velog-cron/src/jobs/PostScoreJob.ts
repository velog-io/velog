import { DbService } from '@lib/db/DbService.js'
import PostService from '@services/PostService.js'
import { injectable, singleton } from 'tsyringe'
import { startOfDay, endOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

@singleton()
@injectable()
export class PostScoreJob {
  constructor(private readonly postService: PostService, private readonly db: DbService) {}
  private jobInProgress = false
  public get isJobProgressing() {
    return this.jobInProgress
  }
  public startPostScoreJob() {
    this.jobInProgress = true
  }
  public stopPostScoreJob() {
    this.jobInProgress = false
  }
  public async scoreCalculation() {
    console.log('Posts score calculation started...')
    console.time('scoreCalculation')
    const utcTime = new Date()
    const timezone = 'Asia/Seoul'
    const tz = utcToZonedTime(utcTime, timezone)
    const startOfToday = startOfDay(tz) // 오늘 날짜의 시작 시간 (KST)
    const endOfToday = endOfDay(tz) // 오늘 날짜의 끝 시간 (KST)

    const posts = await this.db.post.findMany({
      where: {
        is_private: false,
        likes: {
          gte: 1,
        },
        score: 10,
        released_at: {
          gte: startOfToday,
          lte: endOfToday,
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

    for (let i = 0; i < queue.length; i++) {
      const postIds = queue[i]
      for (const postId of postIds) {
        await this.postService.scoreCarculator(postId)
      }
    }

    console.timeEnd('scoreCalculation')
    console.log('Posts score calculation completed')
    console.log(`Recalculated number of posts: ${posts.length}`)
  }
}
