import { BadRequestError } from '@errors/badRequestErrors'
import { UnauthorizedError } from '@errors/unauthorizedError'
import { ReadingListInput } from '@graphql/generated'
import { DbService } from '@lib/db/DbService'
import { Post } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import {
  GetPostsByTypeParams,
  PostServiceBase,
} from '@services/PostService/PostServiceBase'

@injectable()
@singleton()
export class PostService extends PostServiceBase {
  constructor(private readonly db: DbService) {
    super()
  }
  public async getReadingList(
    input: ReadingListInput,
    userId: string | undefined
  ): Promise<Post[]> {
    const { cursor, limit = 20, type } = input

    if (limit > 100) {
      throw new BadRequestError('Max limit is 100')
    }

    if (!userId) {
      throw new UnauthorizedError('Not Logged In')
    }

    const postGetter = {
      LIKED: this.getPostsByLiked,
      READ: this.getPostsByRead,
    }

    const selectedGetter = postGetter[type]
    return await selectedGetter({ cursor, userId, limit })
  }
  protected async getPostsByLiked(
    input: GetPostsByTypeParams
  ): Promise<Post[]> {
    const { cursor, userId, limit } = input
    const cursorData = cursor
      ? await this.db.postLike.findFirst({
          where: {
            fk_user_id: userId,
            fk_post_id: cursor,
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
  protected async getPostsByRead(input: GetPostsByTypeParams) {
    const { cursor, userId, limit } = input
    const cursorData = cursor
      ? await this.db.postReadLog.findFirst({
          where: {
            fk_post_id: cursor,
            fk_user_id: userId,
          },
        })
      : null

    const cursorQueryOption = cursorData
      ? {
          updated_at: {
            lt: cursorData?.updated_at,
          },
          id: {
            not: cursorData?.id,
          },
        }
      : {}

    const logs = await this.db.postReadLog.findMany({
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
    return logs.map((log) => log.Post)
  }
}
