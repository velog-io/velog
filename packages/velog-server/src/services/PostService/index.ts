import { Post, Prisma } from '@prisma/client'
import { container, injectable, singleton } from 'tsyringe'
import {
  ReadPostInput,
  ReadingListInput,
  RecentPostsInput,
  TrendingPostsInput,
} from '@graphql/generated.js'
import { DbService } from '@lib/db/DbService.js'
import { BadRequestError, UnauthorizedError } from '@errors/index.js'
import { GetPostsByTypeParams } from './PostServiceInterface'
import { CacheService } from '@lib/cache/CacheService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { PostReadLogService } from '@services/PostReadLogService/index.js'

interface Service {
  getReadingList(input: ReadingListInput, userId: string | undefined): Promise<Post[]>
  // private getPostsByRead(input: GetPostsByTypeParams): Promise<Post[]>
  // private getPostsByLiked(input: GetPostsByTypeParams): Promise<Post[]>
  getRecentPosts(input: RecentPostsInput, userId: string | undefined): Promise<Post[]>
  getTrendingPosts(input: TrendingPostsInput, ip: string | null): Promise<Post[]>
  getPost(input: ReadPostInput, userId: string | undefined): Promise<Post | null>
}

@injectable()
@singleton()
export class PostService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly cache: CacheService,
    private readonly utils: UtilsService
  ) {}
  public async postsByIds(ids: string[], include?: Prisma.PostInclude): Promise<Post[]> {
    const posts = await this.db.post.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        ...(include || {}),
      },
    })

    return posts
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
        post: true,
      },
    })
    return likes.map((like) => like.post!)
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
        post: true,
      },
    })
    return logs.map((log) => log.post)
  }
  public async getRecentPosts(
    input: RecentPostsInput,
    userId: string | undefined
  ): Promise<Post[]> {
    const { cursor, limit = 20 } = input

    if (limit > 100) {
      throw new BadRequestError('Max limit is 100')
    }

    let whereInput: Prisma.PostWhereInput = {
      is_temp: false,
    }

    if (!userId) {
      whereInput = { ...whereInput, is_private: false }
    } else {
      whereInput = {
        AND: [
          { ...whereInput },
          {
            OR: [
              {
                is_private: false,
              },
              {
                fk_user_id: userId,
              },
            ],
          },
        ],
      }
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

      const OR: any[] = [
        {
          AND: [
            {
              released_at: {
                equals: post.released_at,
              },
            },
            { id: { lt: post.id } },
          ],
        },
        {
          released_at: {
            lt: post.released_at,
          },
        },
      ]

      whereInput = { ...whereInput, OR: OR }
    }

    try {
      const posts = await this.db.post.findMany({
        where: whereInput,
        orderBy: [
          {
            released_at: 'desc',
          },
          {
            id: 'desc',
          },
        ],
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
        take: limit,
      })

      return posts
    } catch (error) {
      console.log(error)
      return []
    }
  }
  public async getTrendingPosts(input: TrendingPostsInput, ip: string | null): Promise<Post[]> {
    const { offset = 0, limit = 20, timeframe = 'month' } = input

    const timeframes: [string, number][] = [
      ['day', 1],
      ['week', 7],
      ['month', 30],
      ['year', 365],
    ]

    const selectedTimeframe = timeframes.find(([text]) => text === timeframe)

    if (!selectedTimeframe) {
      throw new BadRequestError('Invalid timeframe')
    }

    if (timeframe === 'year') {
      console.log('trendingPosts - year', { offset, limit, ip })
    }

    if (timeframe === 'year' && offset > 1000) {
      console.log('Detected GraphQL Abuse', ip)
      return []
    }

    if (limit > 100) {
      throw new BadRequestError('Limit is too high')
    }

    let ids: string[] = []
    const cacheKey = this.cache.generateKey.trending(selectedTimeframe[0], offset, limit)

    const cachedIds = this.cache.lruCache.get(cacheKey)
    if (cachedIds) {
      ids = cachedIds
    } else {
      try {
        const rows = (await this.db.$queryRaw(Prisma.sql`
        select posts.id, posts.title, SUM(score) as score from post_scores
        inner join posts on post_scores.fk_post_id = posts.id
        where post_scores.created_at > now() - interval '1 day' * ${selectedTimeframe[1]}
        and posts.released_at > now() - (interval '1 day' * ${
          selectedTimeframe[1]
        }) - (interval '1 hour' * ${selectedTimeframe[1] * 12})
        group by posts.id
        order by score desc, posts.id desc
        offset ${offset}
        limit ${limit}
      `)) as { id: string; score: number }[]

        ids = rows.map((row) => row.id)
        this.cache.lruCache.set(cacheKey, ids)
      } catch (error) {
        console.log(error)
        return []
      }
    }

    const posts = await this.postsByIds(ids, { user: { include: { profile: true } } })

    const normalized = this.utils.normalize(posts)
    const ordered = ids.map((id) => normalized[id])
    return ordered
  }
  public async getPost(input: ReadPostInput, userId: string | undefined): Promise<Post | null> {
    const { id, url_slug, username } = input
    if (id) {
      const post = await this.db.post.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      })

      if (!post || ((post.is_temp || post.is_private) && post.fk_user_id !== userId)) {
        return null
      }
      return post
    }

    let post = await this.db.post.findFirst({
      where: {
        url_slug,
        user: {
          username,
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!post) {
      const fallbackPost = await this.db.urlSlugHistory.findFirst({
        where: {
          url_slug,
          user: {
            username,
          },
        },
        include: {
          post: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
          user: true,
        },
      })
      if (fallbackPost) {
        post = fallbackPost.post!
      }
    }
    if (!post) return null
    if ((post.is_temp || post.is_private) && post.fk_user_id !== userId) return null

    setTimeout(async () => {
      if (post?.fk_user_id === userId || !userId) return
      if (!post) return
      const postReadLogService = container.resolve(PostReadLogService)
      postReadLogService.log({
        userId: userId,
        postId: post.id,
        resumeTitleId: null,
        percentage: 0,
      })
    }, 0)

    return post
  }
}
