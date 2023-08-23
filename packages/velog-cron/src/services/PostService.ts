import { DbService } from '@lib/db/DbService.js'
import { Post } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findById(postId: string): Promise<Post | null>
  scoreCarculator(postId: string): Promise<void>
}

@singleton()
@injectable()
export default class PostService implements Service {
  constructor(private readonly db: DbService) {}
  public async findById(postId: string): Promise<Post | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
    })
    return post
  }
  public async scoreCarculator(postId: string): Promise<void> {
    const post = await this.findById(postId)

    if (!post) {
      throw new Error('Not found Post')
    }

    const postLikes = await this.db.postLike.count({
      where: {
        fk_post_id: postId,
      },
    })

    const ONE_HOUR = 1000 * 60 * 60
    const itemHourAge = (Date.now() - post.released_at!.getTime()) / ONE_HOUR
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

    console.log('newScore', newScore)
  }
}
