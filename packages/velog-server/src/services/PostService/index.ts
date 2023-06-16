import { DbService } from '@lib/db/DbService'
import type { Post } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class PostService {
  constructor(private readonly db: DbService) {}
  public async getReadingListLikedType(
    postId: string | null,
    userId: string,
    limit: number
  ): Promise<Post[]> {
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
      include: {
        Post: true,
      },
    })
    return likes.map((like) => like.Post!)
  }
}
