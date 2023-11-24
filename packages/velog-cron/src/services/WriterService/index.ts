import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Prisma } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import { subMonths } from 'date-fns'

interface Service {
  generateTrendingWriters(): Promise<GenerateTrendingWriters[]>
}

@injectable()
@singleton()
export class WriterService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public async generateTrendingWriters(): Promise<GenerateTrendingWriters[]> {
    const threeMonthAgo = subMonths(this.utils.now, 3)
    const sixMonthAgo = subMonths(this.utils.now, 6)

    const postLikes = await this.db.postLike.findMany({
      where: {
        created_at: { gte: threeMonthAgo },
        post: {
          released_at: { gte: sixMonthAgo },
          is_temp: false,
          is_private: false,
        },
      },
      select: {
        post: {
          select: {
            id: true,
            title: true,
            url_slug: true,
            thumbnail: true,
            likes: true,
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    display_name: true,
                    short_bio: true,
                    thumbnail: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    const calcuatedTotalLikes = postLikes.reduce<CalculatedTotalLikes>(this.calculateTotalLikes, {
      writers: new Map(),
      postIds: new Set(),
    })

    return Array.from(calcuatedTotalLikes.writers)
      .filter(([, post]) => post.totalLikes > 4)
      .sort(([, a], [, b]) => b.totalLikes - a.totalLikes)
      .map(([id, { user, posts, totalLikes }], index) => ({ index, id, user, posts, totalLikes }))
  }
  private calculateTotalLikes(result: CalculatedTotalLikes, postLike: PostLikePaylaod) {
    const { user, ...post } = postLike.post!

    if (!user || !post) return result

    const userId = user.id
    const exists = result.writers.get(userId)
    const isCounted = result.postIds.has(post.id)

    if (!isCounted) {
      result.postIds.add(post.id)
    }

    if (exists) {
      const set = new Set<string>()
      const posts = exists.posts
        .concat(post)
        .filter((post) => (!set.has(post.id) ? (set.add(post.id), true) : false))
        .sort((a, b) => b.likes! - a.likes!)
        .slice(0, 3)

      const data: MapData = {
        user,
        posts,
        totalLikes: exists.totalLikes + (isCounted ? 0 : post.likes!),
      }

      result.writers.set(userId, data)
    } else {
      const data = { user: user, posts: [post], totalLikes: post.likes! }
      result.writers.set(userId, data)
    }
    return result
  }
}

type PostLikePaylaod = Prisma.PostLikeGetPayload<{
  select: {
    post: {
      select: {
        id: true
        title: true
        url_slug: true
        thumbnail: true
        likes: true
        user: {
          select: {
            id: true
            username: true
            profile: {
              select: {
                display_name: true
                short_bio: true
                thumbnail: true
              }
            }
          }
        }
      }
    }
  }
}>

type User = Prisma.UserGetPayload<{
  select: {
    id: true
    username: true
    profile: {
      select: {
        display_name: true
        short_bio: true
        thumbnail: true
      }
    }
  }
}>

type Post = Prisma.PostGetPayload<{
  select: {
    id: true
    title: true
    url_slug: true
    thumbnail: true
    likes: true
  }
}>

type MapBase = { user: User; posts: Post[] }
type MapData = MapBase & { totalLikes: number }
type CalculatedTotalLikes = { writers: Map<string, MapData>; postIds: Set<string> }
type GenerateTrendingWriters = { index: number; id: string; user: User; posts: Post[] }
