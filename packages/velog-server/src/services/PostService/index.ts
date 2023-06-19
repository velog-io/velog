import type { Post, Prisma } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import { ReadingListInput, RecentPostsInput } from '@graphql/generated.js'
import { DbService } from '@lib/db/DbService.js'
import { BadRequestError } from '@errors/BadRequestErrors.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'

import {
  GetPostsByTypeParams,
  PostServiceInterface,
} from './PostServiceInterface'

@injectable()
@singleton()
export class PostService implements PostServiceInterface {
  constructor(private readonly db: DbService) {}
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
  private async getPostsByLiked(input: GetPostsByTypeParams): Promise<Post[]> {
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
  private async getPostsByRead(input: GetPostsByTypeParams) {
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
  public async getRecentPosts(input: RecentPostsInput, userId: string) {
    const { cursor, limit = 20 } = input

    if (limit > 100) {
      throw new BadRequestError('Max limit is 100')
    }

    let whereInput: Prisma.PostWhereInput = {
      is_temp: false,
      OR: [],
    }

    if (!userId) {
      whereInput.is_private = false
    } else {
      whereInput.OR = [{ is_private: false }, { fk_user_id: userId }]
    }

    if (cursor) {
      const post = await this.db.post.findUnique({
        where: {
          id: cursor,
        },
      })

      if (!post) {
        throw new BadRequestError('Invalid cursor')
      }

      whereInput = {
        released_at: {
          gt: post.released_at!,
        },
        OR: [
          { released_at: post.released_at },
          { id: { gt: post.id } },
          ...(whereInput.OR as []),
        ],
        ...whereInput,
      }
    }

    const posts = await this.db.post.findMany({
      where: whereInput,
      orderBy: {
        released_at: 'desc',
        id: 'desc',
      },
      include: {
        user: true,
      },
      take: limit,
    })

    return posts
  }
}
