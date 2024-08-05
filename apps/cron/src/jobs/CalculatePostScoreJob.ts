import { DbService } from '@lib/db/DbService.js'
import { PostService } from '@services/PostService/index.js'
import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from '@jobs/JobProgress.js'

@singleton()
@injectable()
export class CalculatePostScoreJob extends JobProgress implements Job {
  constructor(
    private readonly postService: PostService,
    private readonly db: DbService,
  ) {
    super()
  }
  public async runner(score: number) {
    console.log('Calculate post score job start...')
    console.time('post score calculate')

    const posts = await this.db.post.findMany({
      where: {
        is_private: false,
        score: {
          gte: score,
        },
      },
      select: {
        id: true,
      },
    })

    for (let i = 0; i < posts.length; i++) {
      const postId = posts[i].id
      await this.postService.scoreCalculator(postId)
    }

    console.log(`Completed, target post count: ${posts.length}`)
    console.timeEnd('post score calculate')
  }
}
