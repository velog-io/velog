import { DbService } from '@lib/db/DbService'
import { Post } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class PostService {
  constructor(private readonly db: DbService) {}
  public async getPostsLikedType(postId, userId, limit) {
    const cursorData = postId
      ? await this.db.postLike.findFirst({
          where: {
            fk_user_id: userId,
            fk_post_id: postId,
          },
        })
      : null

    const cursorQueryOption = cursorData
      ? {
          updated_at: {
            lt: cursorData?.created_at,
          },
          id: { not: cursorData?.id },
        }
      : {}

    const likes = await this.db.postLike.findMany({
      where: {
        fk_user_id: userId,
        ...cursorQueryOption,
      },
      orderBy: {
        updated_at: 'desc',
        id: 'asc',
      },
      take: limit,
      select: {
        Post: true,
      },
    })
    return likes.map((like) => like.Post!)
  }
}
