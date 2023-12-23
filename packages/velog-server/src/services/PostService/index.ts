import removeMd from 'remove-markdown'
import { Post, PostTag, Prisma, Tag, User } from '@prisma/client'
import { container, injectable, singleton } from 'tsyringe'
import {
  FeedPostsInput,
  GetPostsInput,
  GetSearchPostsInput,
  ReadPostInput,
  ReadingListInput,
  RecentPostsInput,
  TrendingPostsInput,
} from '@graphql/generated.js'
import { DbService } from '@lib/db/DbService.js'
import { BadRequestError, ConfilctError, NotFoundError, UnauthorizedError } from '@errors/index.js'
import { GetPostsByTypeParams, Timeframe } from './PostServiceInterface'
import { CacheService } from '@lib/cache/CacheService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { PostReadLogService } from '@services/PostReadLogService/index.js'
import { subDays, subYears } from 'date-fns'
import axios from 'axios'
import { ENV } from '@env'
import { RedisService } from '@lib/redis/RedisService.js'
import { ElasticSearchService } from '@lib/elasticSearch/ElasticSearchService.js'
import { Time } from '@constants/TimeConstants.js'
import { TagService } from '@services/TagService/index.js'

interface Service {
  getPostsByIds(ids: string[], include?: Prisma.PostInclude): Promise<Post[]>
  getPost(input: ReadPostInput, signedUserId?: string): Promise<Post | null>
  getReadingList(input: ReadingListInput, signedUserId?: string): Promise<Post[]>
  getTrendingPosts(input: TrendingPostsInput, ip: string | null): Promise<Post[]>
  getRecentPosts(input: RecentPostsInput, signedUserId?: string): Promise<Post[]>
  getFeedPosts(input: FeedPostsInput, singedUserId?: string): Promise<Post[]>
  updatePostScore(postId: string): Promise<void>
  shortDescription(post: Post): string
  recommendedPosts(post: Post): Promise<Post[]>
  getPosts(input: GetPostsInput, signedUserId?: string): Promise<Post[]>
  getSeachPost(input: GetSearchPostsInput): Promise<{ count: number; posts: Post[] }>
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
    private readonly tagService: TagService,
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
  public async getRecentPosts(input: RecentPostsInput, singedUserId?: string): Promise<Post[]> {
    const { cursor, limit = 20 } = input

    if (limit > 100) {
      throw new BadRequestError('Max limit is 100')
    }

    let whereInput: Prisma.PostWhereInput = {
      is_temp: false,
    }

    if (!singedUserId) {
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
                fk_user_id: singedUserId,
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

    const cacheKey = this.cache.generateKey.trendingPosts(timeframe, offset, limit)
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
  public async getPost(input: ReadPostInput, signedUserId?: string): Promise<Post | null> {
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

      if (!post || ((post.is_temp || post.is_private) && post.fk_user_id !== signedUserId)) {
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
    if ((post.is_temp || post.is_private) && post.fk_user_id !== signedUserId) return null

    setTimeout(async () => {
      if (post?.fk_user_id === signedUserId || !signedUserId) return
      if (!post) return
      const postReadLogService = container.resolve(PostReadLogService)
      postReadLogService.log({
        userId: signedUserId,
        postId: post.id,
        resumeTitleId: null,
        percentage: 0,
      })
    }, 0)

    return post
  }
  private serialize(post: SerializeArgs): SerializePost {
    return {
      id: post.id,
      url: `${ENV.clientV2Host}/@${post.user.username}/${encodeURI(post.url_slug ?? '')}`,
      title: post.title,
      thumbnail: post.thumbnail,
      released_at: post.released_at,
      updated_at: post.updated_at,
      short_description: this.shortDescription(post),
      body: post.body,
      tags: post.postTags.map((tags) => tags.tag!.name!),
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
    const tagLoader = this.tagService.tagLoader()
    const tags = await tagLoader.load(postId)
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
        postIds = recommendedPosts.body.hits.hits.map((hit: any) => hit._id as string)
        const diff = 12 - postIds.length
        if (diff > 0) {
          const fallbackPosts = await this.elsaticSearch.client.search({
            index: 'posts',
            body: {
              query: this.elsaticSearch.buildQuery.fallbackRecommendedPosts(),
              size: 100,
            },
          })
          const fallbackPostIds: string[] = fallbackPosts.body.hits.hits.map((hit: any) => hit._id)
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
  public async getPosts(input: GetPostsInput, signedUserId?: string): Promise<Post[]> {
    const { cursor, limit = 10, username, temp_only = false, tag } = input

    if (limit > 100) {
      throw new BadRequestError('Max limit is 100')
    }

    const user = await this.db.user.findUnique({
      where: {
        username,
      },
    })

    if (tag) {
      return this.findPostsByTag({
        cursor,
        tagName: tag,
        userId: user?.id,
        isSelf: user?.id === signedUserId,
      })
    }

    if (user && !temp_only) {
      return this.findPostsByUserId({
        userId: user.id,
        size: limit,
        cursor: cursor,
        isUserSelf: user.id === signedUserId,
      })
    }

    const whereQuery: Prisma.PostWhereInput = {}

    if (!signedUserId) {
      const query: Prisma.PostWhereInput = {
        is_private: false,
      }
      Object.assign(whereQuery, { ...query })
    } else {
      const query: Prisma.PostWhereInput = {
        OR: [{ is_private: false }, { fk_user_id: signedUserId }],
      }
      Object.assign(whereQuery, { ...query })
    }

    if (temp_only) {
      if (!username) throw new BadRequestError('username is missing')
      if (!user) throw new NotFoundError('Invalid username')
      if (user.id !== signedUserId)
        throw new UnauthorizedError('You have no permission to load temp posts')

      Object.assign(whereQuery, { is_temp: true })
    } else {
      Object.assign(whereQuery, { is_temp: false })
    }

    if (username) {
      const query: Prisma.PostWhereInput = {
        user: {
          username: username,
        },
      }
      Object.assign(whereQuery, { ...query })
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

      const query: Prisma.PostWhereInput = {
        released_at: {
          lt: post.released_at!,
        },
      }

      Object.assign(whereQuery, { ...query })

      const orQuery = {
        OR: [{ AND: [{ released_at: post.released_at }, { id: { lt: post.id } }] }],
      }

      if (whereQuery.OR) {
        Object.assign(whereQuery, { OR: whereQuery.OR.concat(orQuery.OR) })
      } else {
        Object.assign(whereQuery, { ...query })
      }
    }

    const posts = await this.db.post.findMany({
      where: whereQuery,
      include: {
        user: true,
      },
      orderBy: {
        released_at: 'desc',
      },
      take: limit,
    })

    return posts
  }
  private async findPostsByTag({
    cursor,
    tagName,
    userId,
    isSelf,
  }: FindPostsByTagArgs): Promise<Post[]> {
    const originTag = await this.tagService.getOriginTag(tagName)
    if (!originTag) {
      throw new ConfilctError('Invalid tag')
    }

    const cursorPost = cursor
      ? await this.db.post.findUnique({
          where: { id: cursor },
        })
      : null

    const postTags = await this.db.postTag.findMany({
      where: {
        fk_tag_id: originTag.id,
        post: {
          is_temp: false,
          ...(cursorPost
            ? {
                released_at: {
                  lt: cursorPost.released_at!,
                },
              }
            : {}),
          ...(userId
            ? { fk_user_id: userId, ...(isSelf ? {} : { is_private: false }) }
            : { is_private: false }),
        },
      },
      include: {
        post: {
          include: {
            postTags: {
              include: {
                tag: true,
              },
            },
            user: true,
          },
        },
      },
      orderBy: {
        post: {
          released_at: 'desc',
        },
      },
      take: 20,
    })

    return postTags.filter((tags) => tags.post).map((tags) => tags.post!)
  }
  private async findPostsByUserId({
    userId,
    size,
    cursor,
    isUserSelf = false,
  }: FindPostByUserIdArgs) {
    const cursorPost = cursor
      ? await this.db.post.findUnique({
          where: {
            id: cursor,
          },
        })
      : null

    const limitedSize = Math.min(50, size)

    const posts = await this.db.post.findMany({
      where: {
        fk_user_id: userId,
        ...(isUserSelf ? {} : { is_private: false }),
        is_temp: false,
        released_at: cursorPost?.released_at ? { lt: cursorPost.released_at } : undefined,
      },
      orderBy: {
        released_at: 'desc',
      },
      take: limitedSize,
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
        user: true,
      },
    })

    return posts
  }
  public async getSeachPost(
    input: GetSearchPostsInput,
    signedUserId?: string,
  ): Promise<{ count: number; posts: Post[] }> {
    const { keyword, offset = 0, limit = 20, username } = input

    if (limit > 100) {
      throw new BadRequestError('Max limit is 100')
    }

    const result = await this.elsaticSearch.keywordSearch({
      keyword,
      username,
      from: offset,
      size: limit,
      signedUserId,
    })

    return result
  }
  async getFeedPosts(input: FeedPostsInput, singedUserId?: string): Promise<Post[]> {
    if (!singedUserId) {
      return []
    }

    const { offset = 0, limit = 20 } = input

    if (limit < 0 || offset < 0) {
      throw new BadRequestError('Invalid value')
    }

    if (limit > 100) {
      throw new BadRequestError('Limit is too high')
    }

    const feeds = await this.db.feed.findMany({
      where: {
        fk_user_id: singedUserId,
      },
      include: {
        post: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        created_at: 'desc',
      },
    })

    const posts = feeds.map((feed) => feed.post)
    return posts
  }
}

export type SerializePost = {
  id: string
  title: string | null
  body: string | null
  thumbnail: string | null
  released_at: Date | null
  updated_at: Date
  likes: number | null
  url_slug: string | null
  url: string
  short_description: string
  tags: string[]
  fk_user_id: string
}

type SerializeArgs = Post & {
  postTags: (PostTag & {
    tag: Tag | null
  })[]
  user: User
}

export type FindPostsByTagArgs = {
  tagName: string
  cursor?: string
  limit?: number
  userId?: string
  isSelf: boolean
}

type FindPostByUserIdArgs = {
  userId: string
  size: number
  cursor?: string
  isUserSelf?: boolean
}
