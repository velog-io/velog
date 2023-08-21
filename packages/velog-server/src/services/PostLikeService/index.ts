import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { SearchService } from '@lib/search/SearchService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Post } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  likePost(postId?: string, userId?: string): Promise<Post>
}

@injectable()
@singleton()
export class PostLikeService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
    private readonly search: SearchService
  ) {}
  async likePost(postId?: string, userId?: string): Promise<Post> {
    if (!postId) {
      throw new BadRequestError('PostId is required')
    }

    if (!userId) {
      throw new UnauthorizedError('Not Logged In')
    }

    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
    })

    if (!post) {
      throw new NotFoundError('Post not found')
    }

    const alreadyLiked = await this.db.postLike.findFirst({
      where: {
        fk_post_id: postId,
        fk_user_id: userId,
      },
    })

    if (alreadyLiked) {
      return post
    }

    try {
      await this.db.postLike.create({
        data: {
          fk_post_id: postId,
          fk_user_id: userId,
        },
      })
    } catch (_) {
      return post
    }

    await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    })

    const unscored = this.utils.checkUnscore(post.body!.concat(post.title || ''))
    if (!unscored) {
      // Cron API 호출
    }

    setTimeout(() => {
      this.search.searchSync.update(post.id)
    }, 0)

    return post
  }
}
