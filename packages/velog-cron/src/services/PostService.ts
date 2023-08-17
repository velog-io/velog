import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'

@singleton()
@injectable()
export default class PostService {
  constructor(private readonly db: DbService) {}
  public async scoreCarculator(postId: string) {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
    })

    if (!post) {
      throw new Error('Not found Post')
    }

    const postLikes = await this.db.postLike.count({
      where: {
        fk_post_id: postId,
      },
    })

    const ONE_HOUR = 1000 * 60 * 60
    const itemHourAge = (Date.now() - post.created_at.getTime()) / ONE_HOUR
    const gravity = 1.8
    const votes = postLikes * 3

    const newScore = (votes - 1) / Math.pow(itemHourAge + 2, gravity)
    await this.db.post.update({
      where: {
        id: post.id,
      },
      data: {
        score: newScore,
      },
    })
  }
}
