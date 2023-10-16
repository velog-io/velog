import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService'
import { Post, Prisma, User } from '@prisma/client'
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
  ) {}
  public async getFollowings(fk_follower_id: string): Promise<User[]> {
    const followUser = await this.db.followUser.findMany({
      where: {
        fk_follower_user_id: fk_follower_id,
      },
      select: {
        following: true,
      },
    })
    const followings = followUser.map((follow) => follow.following)
    return followings
  }
  public async createRecommendFollower() {
    const threeMonthAgo = subMonths(this.utils.now, 3)
    const likes = await this.db.postLike.findMany({
      where: {
        created_at: { gte: threeMonthAgo },
      },
      include: {
        post: {
          select: {
            id: true,
            url_slug: true,
            thumbnail: true,
            likes: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
          include: {
            profile: {
              select: {
                display_name: true,
                short_bio: true,
              },
            },
          },
        },
      },
    })

    const map = likes.reduceRight<RecommendFollowerMap>(this.sumLikes, new Map())
    return Array.from(map).sort(([, a], [, b]) => b.totalLikes - a.totalLikes)
  }

  private sumLikes(map: RecommendFollowerMap, likes: Likes) {
    const post = likes!.post!
    const user = likes!.user!

    const postId = post!.id
    const exists = map.get(postId)

    if (exists) {
      const data = {
        user,
        posts: exists.posts.concat(post),
        totalLikes: exists.totalLikes + post.likes!,
      }
      map.set(postId, data)
      return map
    } else {
      const data = { user, posts: [post], totalLikes: post.likes! }
      map.set(postId, data)
    }
    return map
  }
}

type RecommendFollowerMap = Map<string, { user: User; posts: Partial<Post>[]; totalLikes: number }>
type Likes = Prisma.PostLikeGetPayload<{
  include: {
    post: {
      select: {
        id: true
        url_slug: true
        thumbnail: true
        likes: true
      }
    }
    user: {
      select: {
        id: true
        username: true
      }
      include: {
        profile: {
          select: {
            display_name: true
            short_bio: true
          }
        }
      }
    }
  }
}>
