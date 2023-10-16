import removeMd from 'remove-markdown'
import { Post, Prisma, Tag } from '@prisma/client'
import { container, injectable, singleton } from 'tsyringe'
import {
  ReadPostInput,
  ReadingListInput,
  RecentPostsInput,
  TrendingPostsInput,
} from '@graphql/generated.js'
import { DbService } from '@lib/db/DbService.js'
import { BadRequestError, UnauthorizedError } from '@errors/index.js'
import { GetPostsByTypeParams, Timeframe } from './PostServiceInterface'
import { CacheService } from '@lib/cache/CacheService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { PostReadLogService } from '@services/PostReadLogService/index.js'
import { subDays, subYears } from 'date-fns'
import axios from 'axios'
import { ENV } from '@env'
import { RedisService } from '@lib/redis/RedisService.js'
import { PostTagService } from '@services/PostTagService/index.js'
import { ElasticSearchService } from '@lib/elasticSearch/ElasticSearchService.js'
import { Time } from '@constants/TimeConstants.js'

interface Service {
  getPostsByIds(ids: string[], include?: Prisma.PostInclude): Promise<Post[]>
  getReadingList(input: ReadingListInput, userId: string | undefined): Promise<Post[]>
  getRecentPosts(input: RecentPostsInput, userId: string | undefined): Promise<Post[]>
  getTrendingPosts(input: TrendingPostsInput, ip: string | null): Promise<Post[]>
  getPost(input: ReadPostInput, userId: string | undefined): Promise<Post | null>
  updatePostScore(postId: string): Promise<void>
  shortDescription(post: Post): string
  recommendedPosts(post: Post): Promise<Post[]>
}

@injectable()
@singleton()
export class PostService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly cache: CacheService,
    private readonly utils: UtilsService,
    private readonly redis: RedisService,
    private readonly elsaticSearch: ElasticSearchService,
    private readonly postTagsService: PostTagService,
  ) {}
  public async getPostsByIds(ids: string[], include?: Prisma.PostInclude): Promise<Post[]> {
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
    userId: string | undefined,
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
    userId: string | undefined,
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
    const { offset = 0, limit = 20, timeframe = 'week' } = input

    const timeframes: Timeframe[] = ['day', 'week', 'month', 'year']

    if (!timeframes.includes(timeframe as Timeframe)) {
      throw new BadRequestError('Invalid timeframe')
    }

    if (timeframe === 'year' && offset > 1000) {
      console.log('Detected GraphQL Abuse', ip)
      return []
    }

    if (limit > 100) {
      throw new BadRequestError('Limit is too high')
    }

    const cacheKey = this.cache.generateKey.trending(timeframe, offset, limit)
    let postIds: string[] | undefined = this.cache.lruCache.get(cacheKey)
    if (!postIds) {
      const now = this.utils.now

      const timeMapper: Record<Timeframe, Date> = {
        day: subDays(now, 3),
        week: subDays(now, 14),
        month: subDays(now, 45),
        year: subYears(now, 1),
      }

      const since = timeMapper[timeframe as Timeframe]
      const posts = await this.db.post.findMany({
        where: {
          is_private: false,
          released_at: {
            gte: since,
          },
        },
        select: {
          id: true,
        },
        orderBy: {
          [timeframe === 'year' ? 'likes' : 'score']: 'desc',
        },
        take: limit,
        skip: offset,
      })

      postIds = posts.map((post) => post.id)
      this.cache.lruCache.set(cacheKey, postIds)
    }

    const posts = await this.getPostsByIds(postIds, { user: { include: { profile: true } } })
    const normalized = this.utils.normalize(posts)
    const ordered = postIds.map((id) => normalized[id])
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
  private serialize(post: SerializeParam): SerializedPost {
    return {
      id: post.id,
      url: `${ENV.apiHost}/@${post.user.username}/${encodeURI(post.url_slug ?? '')}`,
      title: post.title,
      thumbnail: post.thumbnail,
      released_at: post.released_at,
      updated_at: post.updated_at,
      shortDescription: this.shortDescription(post),
      body: post.body,
      tags: post.tags.map((tag) => tag.name || '').filter(Boolean),
      fk_user_id: post.fk_user_id,
      url_slug: post.url_slug,
      likes: post.likes,
    }
  }
  async updatePostScore(postId: string) {
    await axios.patch(
      `${ENV.cronHost}/api/posts/v1/score/${postId}`,
      {},
      {
        headers: {
          'Cron-Api-Key': ENV.cronApiKey,
        },
      },
    )
  }
  public shortDescription(post: Post): string {
    if (post.short_description) return post.short_description
    if ((post.meta as any)?.short_description) {
      return (post.meta as any).short_description
    }
    if (!post.body) return ''
    const removed = removeMd(
      post.body
        .replace(/```([\s\S]*?)```/g, '')
        .replace(/~~~([\s\S]*?)~~~/g, '')
        .slice(0, 500),
    )
    return removed.slice(0, 200) + (removed.length > 200 ? '...' : '')
  }
  public async recommendedPosts(post: Post): Promise<Post[]> {
    const postId = post.id
    const tags = await this.postTagsService.createTagsLoader().load(postId)
    Object.assign(post, { tags })

    const cacheKey = this.redis.generateKey.recommendedPostKey(postId)
    let postIds: string[]
    try {
      const cachedPostIds = await this.redis.get(cacheKey)
      if (cachedPostIds) {
        postIds = cachedPostIds.split(',')
      } else {
        const recommendedPosts = await this.elsaticSearch.client.search({
          index: 'posts',
          body: {
            query: this.elsaticSearch.buildQuery.recommendedPostsQuery(post),
            size: 12,
          },
        })
        postIds = recommendedPosts.hits.hits.map((hit) => hit._id)
        const diff = 12 - postIds.length
        if (diff > 0) {
          const fallbackPosts = await this.elsaticSearch.client.search({
            index: 'posts',
            body: {
              query: this.elsaticSearch.buildQuery.fallbackRecommendedPosts(),
              size: 100,
            },
          })
          const fallbackPostIds = fallbackPosts.hits.hits.map((hit) => hit._id)
          const randomPostIds = this.utils.pickRandomItems(fallbackPostIds, diff)
          postIds = [...postIds, ...randomPostIds]
        }

        this.redis.set(cacheKey, postIds.join(','), 'EX', Time.ONE_DAY_S)
      }
      const posts = await this.getPostsByIds(postIds)
      const normalized = this.utils.normalize(posts)
      const ordered = postIds.map((id) => normalized[id])
      return ordered.filter((post) => post)
    } catch (error) {
      console.log('recommendedPosts error', error)
      return []
    }
  }
}

export type SerializeParam = Prisma.PostGetPayload<{
  include: {
    id: true
    title: true
    body: true
    thumbnail: true
    is_private: true
    released_at: true
    likes: true
    views: true
    meta: true
    url_slug: true
    user: true
  }
}> & { tags: Tag[] }

export type SerializedPost = {
  id: string
  title: string | null
  body: string | null
  url: string
  thumbnail: string | null
  released_at: Date | null
  likes: number | null
  url_slug: string | null
  tags: string[]
  fk_user_id: string
  shortDescription: string
  updated_at: Date
}
