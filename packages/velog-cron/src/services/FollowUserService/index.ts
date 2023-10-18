import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Prisma } from '@prisma/client'
import { PostService } from '@services/PostService/index.js'
import { subMonths } from 'date-fns'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getFollowings(fk_follower_id: string): Promise<User[]>
  createRecommendFollower(): Promise<RecommedFollowerResult[]>
}

@injectable()
@singleton()
export class FollowUserService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
    private readonly postService: PostService,
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
  public async createRecommendFollower(): Promise<RecommedFollowerResult[]> {
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

    const postLikesMap = postLikes.reduceRight<PostLikesMap>(this.calculateTotalLikes, new Map())
    return Array.from(postLikesMap)
      .sort(([, a], [, b]) => b.totalLikes - a.totalLikes)
      .map(([id, { user, posts }]) => ({ id, user, posts }))
  }
  private calculateTotalLikes(map: PostLikesMap, postLike: PostLikePaylaod) {
    const { user, ...post } = postLike.post!

    if (!user || !post) return map

    const id = user.id
    const exists = map.get(id)

    if (exists) {
      const data: PostLikesMapData = {
        user,
        posts: exists.posts
          .concat(post)
          .sort((a, b) => b.likes! - a.likes!)
          .slice(0, 3),
        totalLikes: exists.totalLikes + post.likes!,
      }
      map.set(id, data)
    } else {
      const data = { user: user, posts: [post], totalLikes: post.likes! }
      map.set(id, data)
    }
    return map
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

type PostLikesMapBase = { user: User; posts: Post[] }
type PostLikesMapData = PostLikesMapBase & { totalLikes: number }
type PostLikesMap = Map<string, PostLikesMapData>
type RecommedFollowerResult = { id: string; user: User; posts: Post[] }
