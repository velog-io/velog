import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Post } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import { PostService } from '@services/PostService/index.js'
import { SearchService } from '@services/SearchService/index.js'

interface Service {
  likePost(postId?: string, userId?: string): Promise<Post>
  unlikePost(postId?: string, userId?: string): Promise<Post>
}

@injectable()
@singleton()
export class PostLikeService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
    private readonly searchService: SearchService,
    private readonly postService: PostService,
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

    await this.db.postLike.create({
      data: {
        fk_post_id: postId,
        fk_user_id: userId,
      },
    })

    const likesCount = await this.db.postLike.count({
      where: {
        fk_post_id: postId,
      },
    })

    const likesPost = await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: likesCount,
      },
    })

    const unscored = this.utils.checkUnscore(post.body!.concat(post.title || ''))
    if (!unscored) {
      await this.postService.updatePostScore(postId)
    }

    setTimeout(() => {
      try {
        this.searchService.searchSync.update(post.id)
      } catch (error) {
        console.log('likePost searchSync update error', error)
      }
    }, 0)

    return likesPost
  }
  async unlikePost(postId?: string, userId?: string): Promise<Post> {
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

    const postLike = await this.db.postLike.findFirst({
      where: {
        fk_post_id: postId,
        fk_user_id: userId,
      },
    })

    if (!postLike) {
      return post
    }

    await this.db.postLike.delete({
      where: {
        id: postLike.id,
      },
    })

    const likesCount = await this.db.postLike.count({
      where: {
        fk_post_id: postId,
      },
    })

    const unlikesPost = await this.db.post.update({
      where: {
        id: postId,
      },
      data: {
        likes: likesCount,
      },
    })

    await this.postService.updatePostScore(postId)
    setTimeout(() => {
      try {
        this.searchService.searchSync.update(post.id)
      } catch (error) {
        console.log('unlikePost searchSync update error', error)
      }
    }, 0)

    return unlikesPost
  }
}
