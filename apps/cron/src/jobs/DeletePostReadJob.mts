import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress.mjs'
import { PostReadService } from '@services/PostReadService/index.mjs'

@injectable()
@singleton()
export class DeletePostReadJob extends JobProgress implements Job {
  constructor(private readonly postReadService: PostReadService) {
    super()
  }
  public async runner() {
    console.log('Delete post read job start...')
    console.time('delete post read')

    const count = 1000
    const postReads = await this.postReadService.findMany(count)

    const postReadIds = postReads.map((postRead) => postRead.id)

    for (const postReadId of postReadIds) {
      await this.postReadService.deleteById(postReadId)
    }

    console.log(`Deleted PostRead count: ${count}`)
    console.timeEnd('delete post read')
  }
}
