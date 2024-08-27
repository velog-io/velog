import { injectable, singleton } from 'tsyringe'
import { Job, JobProgress } from './JobProgress.mjs'
import { FeedService } from '@services/FeedService/index.mjs'

@singleton()
@injectable()
export class DeleteFeedJob extends JobProgress implements Job {
  constructor(private readonly feedService: FeedService) {
    super()
  }
  public async runner() {
    console.log('Delete feed job start...')
    console.time('delete feed')

    const deleted = await this.feedService.deleteFeed()

    console.log(`Deleted Feed count: ${deleted.count}`)
    console.timeEnd('delete feed')
  }
}
