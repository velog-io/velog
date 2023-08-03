import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'

interface Service {
  count(postId: string): Promise<number>
}

@injectable()
@singleton()
export class CommentService implements Service {
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
