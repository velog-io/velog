import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'
import DataLoader from 'dataloader'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Comment, Prisma } from '@packages/database/src/velog-rds.mjs'

interface Service {
  count(postId: string): Promise<number>
  commentsLoader(): DataLoader<string, Comment[]>
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
  public commentsLoader() {
    return this.createCommentsLoader()
  }
  private createCommentsLoader(): DataLoader<string, Comment[]> {
    return new DataLoader(async (postIds) => {
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

      const normalized = this.utils.normalize<
        Prisma.PostGetPayload<{
          include: {
            comment: true
          }
        }>
      >(posts)
      const commentsGroups = postIds.map((id) => (normalized[id] ? normalized[id].comment : []))
      return commentsGroups
    })
  }
}
