import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'
import DataLoader from 'dataloader'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Comment, Post } from '@prisma/client'

interface Service {
  count(postId: string): Promise<number>
  createCommentsLoader(): DataLoader<string, any>
}

@injectable()
@singleton()
export class CommentService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public async count(postId: string) {
    const commentCount = await this.db.comment.count({
      where: {
        fk_post_id: postId,
        deleted: false,
      },
    })
    return commentCount
  }
  public createCommentsLoader() {
    return new DataLoader(async (postIds: readonly string[]) => {
      const posts = await this.db.post.findMany({
        where: {
          id: {
            in: postIds as string[],
          },
        },
        include: {
          comment: {
            where: {
              fk_post_id: {
                in: postIds as string[],
              },
              level: 0,
              OR: [{ deleted: false }, { has_replies: true }],
            },
            orderBy: {
              created_at: 'asc',
            },
          },
        },
      })

      const normalized = this.utils.normalize<Post & { comment: Comment[] }>(posts)
      const commentsGroups = postIds.map((id) => (normalized[id] ? normalized[id].comment : []))
      return commentsGroups
    })
  }
}
