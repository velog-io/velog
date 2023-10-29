import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Prisma } from '@prisma/client'
import { subMonths } from 'date-fns'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getFollowings(fk_follower_id: string): Promise<User[]>
  createRecommendFollowings(): Promise<RecommedFollowingsResult[]>
}

@injectable()
@singleton()
export class FollowService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public async getFollowings(fk_follower_id: string): Promise<User[]> {
    const followUser = await this.db.followUser.findMany({
      where: {
        fk_follower_user_id: fk_follower_id,
      },
      select: {
        following: {
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
    })
    const followings = followUser.map((follow) => follow.following!)
    return followings
  }
  public async createRecommendFollowings(): Promise<RecommedFollowingsResult[]> {
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
      postMap: new Map(),
      countedPostIds: new Set(),
    })

    return Array.from(calcuatedTotalLikes.postMap)
      .filter(([, post]) => post.totalLikes > 4)
      .sort(([, a], [, b]) => b.totalLikes - a.totalLikes)
      .map(([id, { user, posts, totalLikes }]) => ({ id, user, posts, totalLikes }))
  }
  private calculateTotalLikes(result: CalculatedTotalLikes, postLike: PostLikePaylaod) {
    const { user, ...post } = postLike.post!

    if (!user || !post) return result

    const id = user.id
    const exists = result.postMap.get(id)

    const isCounted = result.countedPostIds.has(post.id)

    if (!isCounted) {
      result.countedPostIds.add(post.id)
    }

    if (exists) {
      const set = new Set<string>()
      const posts = exists.posts
        .concat(post)
        .filter((post) => (!set.has(post.id) ? (set.add(post.id), true) : false))
        .sort((a, b) => b.likes! - a.likes!)
        .slice(0, 3)

      const data: PostMap = {
        user,
        posts,
        totalLikes: exists.totalLikes + (isCounted ? 0 : post.likes!),
      }

      result.postMap.set(id, data)
    } else {
      const data = { user: user, posts: [post], totalLikes: post.likes! }
      result.postMap.set(id, data)
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

type PostMapBase = { user: User; posts: Post[] }
type PostMap = PostMapBase & { totalLikes: number }
type CalculatedTotalLikes = { postMap: Map<string, PostMap>; countedPostIds: Set<string> }
type RecommedFollowingsResult = { id: string; user: User; posts: Post[] }
