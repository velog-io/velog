import { DbService } from '@lib/db/DbService.js'
import { PostService } from '@services/PostService/index.js'
import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from '@jobs/JobProgress.js'

@singleton()
@injectable()
export class PostJob extends JobProgress implements Job {
  constructor(
    private readonly postService: PostService,
    private readonly db: DbService,
  ) {
    super()
  }
  public async runner(score: number) {
    console.log('Posts score calculation start...')
    console.time('score calculation')

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

    console.log('target post count:', posts.length)

    for (let i = 0; i < posts.length; i++) {
      const postId = posts[i].id
      console.log(`${i} / ${posts.length}`)
      await this.postService.scoreCarculator(postId)
    }

    console.timeEnd('score calculation')
    console.log(`Completed, recalculated number of posts: ${posts.length}`)
  }
}
