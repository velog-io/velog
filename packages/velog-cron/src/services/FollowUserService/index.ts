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
    const sortedUsers = Array.from(postLikesMap)
      .sort(([, a], [, b]) => b.totalLikes - a.totalLikes)
      .map(([, a]) => a.user)

    const result: RecommedFollowerResult[] = []
    for (let i = 0; i < sortedUsers.length; i++) {
      const user = sortedUsers[i]
      const posts = await this.postService.findByUserId({
        userId: user.id,
        where: {
          created_at: {
            gte: threeMonthAgo,
          },
          is_private: false,
          is_temp: false,
        },
        orderBy: {
          likes: 'desc',
        },
        take: 3,
        select: {
          id: true,
          url_slug: true,
          title: true,
          thumbnail: true,
        },
      })
      const data = { id: user.id, user, posts }
      result.push(data)
    }

    return result
  }
  private calculateTotalLikes(map: PostLikesMap, postLike: PostLikePaylaod) {
    const { post } = postLike

    if (!post) return map

    const postId = post.id
    const exists = map.get(postId)

    if (exists) {
      const data: PostLikesMapData = {
        user: post.user,
        posts: exists.posts.concat(post),
        totalLikes: exists.totalLikes + post.likes!,
      }
      map.set(postId, data)
    } else {
      const data = { user: post.user, posts: [post], totalLikes: post.likes! }
      map.set(postId, data)
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
  }
}>

type PostLikesMapBase = { user: User; posts: Post[] }
type PostLikesMapData = PostLikesMapBase & { totalLikes: number }
type PostLikesMap = Map<string, PostLikesMapData>
type RecommedFollowerResult = { id: string; user: User; posts: Post[] }
