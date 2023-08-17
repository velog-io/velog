import { DbService } from '@lib/db/DbService'
import PostService from '@services/PostService'
import { injectable, singleton } from 'tsyringe'

@singleton()
@injectable()
export class PostScoreJob {
  constructor(readonly postService: PostService, readonly db: DbService) {}
  async scoreCalculation() {}
}
