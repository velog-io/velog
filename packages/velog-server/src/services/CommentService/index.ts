import { DbService } from '@lib/db/DbService.js'
import { CommentServiceInterface } from './CommentServiceInterface.js'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class CommentService implements CommentServiceInterface {
  constructor(private readonly db: DbService) {}
  public async count(postId: string) {
    const commentCount = await this.db.comment.count({
      where: {
        fk_post_id: postId,
        deleted: false,
      },
    })
    return commentCount
  }
}
