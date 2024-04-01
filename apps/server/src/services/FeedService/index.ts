import { BadRequestError } from '@errors/BadRequestErrors.js'
import { FeedPostsInput } from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Post } from '@packages/database/src/velog-rds.mjs'
import { subMonths, subYears } from 'date-fns'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getFeedPosts(input: FeedPostsInput, singedUserId?: string): Promise<Post[]>
  createFeedByFollow(args: CreateFeedByFollowArgs): Promise<void>
  deleteFeedByUnfollow(args: RemoveFeedByFollowArgs): Promise<void>
}

@injectable()
@singleton()
export class FeedService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
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
        is_deleted: false,
      },
      include: {
        post: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        post: {
          created_at: 'desc',
        },
      },
    })

    const posts = feeds.map((feed) => feed.post)
    return posts
  }
  async createFeedByFollow({ followingUserId, followerUserId }: CreateFeedByFollowArgs) {
    // 1개월 동안 만들어진 post를 새롭게 Feed로 생성함, 최대 10개
    const posts = await this.db.post.findMany({
      where: {
        fk_user_id: followingUserId,
        is_private: false,
        is_temp: false,
        created_at: {
          gte: subMonths(this.utils.now, 1),
        },
      },
      take: 10,
      orderBy: {
        created_at: 'asc',
      },
    })

    const data = posts.map(({ id }) => ({ fk_post_id: id, fk_user_id: followerUserId }))

    await this.db.feed.createMany({
      data,
      skipDuplicates: true,
    })

    await this.db.feed.updateMany({
      where: {
        fk_user_id: followerUserId,
        is_deleted: true,
        post: {
          fk_user_id: followingUserId,
        },
        created_at: {
          gte: subYears(this.utils.now, 1),
        },
      },
      data: {
        is_deleted: false,
      },
    })
  }
  async deleteFeedByUnfollow({
    followingUserId,
    followerUserId,
  }: RemoveFeedByFollowArgs): Promise<void> {
    await this.db.feed.updateMany({
      where: {
        fk_user_id: followerUserId,
        post: {
          fk_user_id: followingUserId,
        },
      },
      data: {
        is_deleted: true,
      },
    })
  }
}

type CreateFeedByFollowArgs = {
  followingUserId: string
  followerUserId: string
}

type RemoveFeedByFollowArgs = CreateFeedByFollowArgs
