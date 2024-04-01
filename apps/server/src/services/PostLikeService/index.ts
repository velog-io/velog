import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Post } from '@packages/database/src/velog-rds/index.mjs'
import { injectable, singleton } from 'tsyringe'
import { PostService } from '@services/PostService/index.js'
import { SearchService } from '@services/SearchService/index.js'
import { NotificationService } from '@services/NotificationService/index.js'

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
    private readonly notificationService: NotificationService,
  ) {}
  async likePost(postId?: string, signedUserId?: string): Promise<Post> {
    if (!postId) {
      throw new BadRequestError('PostId is required')
    }

    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const signedUser = await this.db.user.findUnique({
      where: {
        id: signedUserId,
      },
      include: {
        profile: true,
      },
    })

    if (!signedUser) {
      throw new NotFoundError('Not found sigend user')
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
        fk_user_id: signedUserId,
      },
    })

    if (alreadyLiked) {
      return post
    }

    const postLike = await this.db.postLike.create({
      data: {
        fk_post_id: postId,
        fk_user_id: signedUserId,
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
      include: {
        user: true,
      },
      data: {
        likes: likesCount,
      },
    })

    if (post.fk_user_id !== signedUserId) {
      // create notification
      await this.notificationService.createOrUpdate({
        fkUserId: post.fk_user_id,
        actorId: signedUserId,
        actionId: post.id,
        type: 'postLike',
        action: {
          postLike: {
            post_like_id: postLike.id,
            actor_display_name: signedUser.profile?.display_name || '',
            actor_thumbnail: signedUser.profile?.thumbnail || '',
            actor_username: signedUser.username,
            post_id: likesPost.id,
            post_title: likesPost.title || '',
            post_url_slug: likesPost.url_slug || '',
            post_writer_username: likesPost.user.username,
            type: 'postLike',
          },
        },
      })
    }

    const unscored = this.utils.checkUnscore(post.body!.concat(post.title || ''))
    if (!unscored) {
      await this.postService.updatePostScore(postId)
    }

    setTimeout(async () => {
      try {
        await this.searchService.searchSync.update(post.id)
      } catch (error) {
        console.log('likePost searchSync update error', error)
      }
    }, 0)

    return likesPost
  }
  async unlikePost(postId?: string, signedUserId?: string): Promise<Post> {
    if (!postId) {
      throw new BadRequestError('PostId is required')
    }

    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
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
        fk_user_id: signedUserId,
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

    // remove notification
    await this.notificationService.remove({
      fkUserId: post.fk_user_id,
      actorId: signedUserId,
      type: 'postLike',
      actionId: post.id,
    })

    await this.postService.updatePostScore(postId)
    setTimeout(async () => {
      try {
        await this.searchService.searchSync.update(post.id)
      } catch (error) {
        console.log('unlikePost searchSync update error', error)
      }
    }, 0)

    return unlikesPost
  }
}
