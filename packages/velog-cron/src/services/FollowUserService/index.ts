import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Prisma } from '@prisma/client'
import { PostService } from '@services/PostService'
import { subMonths } from 'date-fns'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getFollowings(fk_follower_id: string): Promise<User[]>
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
  public async createRecommendFollower() {
    const threeMonthAgo = subMonths(this.utils.now, 3)
    const postLikes = await this.db.postLike.findMany({
      where: {
        created_at: { gte: threeMonthAgo },
      },
      select: {
        post: {
          select: {
            id: true,
            title: true,
            url_slug: true,
            thumbnail: true,
            likes: true,
          },
        },
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
    })

    const postLikesMap = postLikes.reduceRight<PostLikesMap>(this.sumLikes, new Map())
    const promises = Array.from(postLikesMap)
      .sort(([, a], [, b]) => b.totalLikes - a.totalLikes)
      .map(([, a]) => a.user)
      .map(this.getTrendingPostsByUserId)

    return await Promise.all(promises)
  }
  private sumLikes(map: PostLikesMap, postLike: PostLikePaylaod) {
    const { post, user } = postLike

    if (!user || !post) return map

    const postId = post.id
    const exists = map.get(postId)

    if (exists) {
      const data: PostLikesMapData = {
        user: user!,
        posts: exists.posts.concat(post),
        totalLikes: exists.totalLikes + post.likes!,
      }
      map.set(postId, data)
    } else {
      const data = { user, posts: [post], totalLikes: post.likes! }
      map.set(postId, data)
    }
    return map
  }
  private async getTrendingPostsByUserId(user: User) {}
}

type PostLikePaylaod = Prisma.PostLikeGetPayload<{
  select: {
    post: {
      select: {
        id: true
        url_slug: true
        thumbnail: true
        title: true
        likes: true
      }
    }
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
    url_slug: true
    thumbnail: true
    title: true
    likes: true
  }
}>

type PostLikesMapBase = { user: User; posts: Post[] }
type PostLikesMapData = PostLikesMapBase & { totalLikes: number }
type PostLikesMap = Map<string, PostLikesMapData>
