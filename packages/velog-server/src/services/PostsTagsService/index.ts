import DataLoader from 'dataloader'
import { Prisma } from '@prisma/client'
import { injectable } from 'tsyringe'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'

interface Service {
  // getPostsByTag(params: GetPostsByTagParams): Promise<Post[]>
  createTagsLoader(): DataLoader<string, any>
}

@injectable()
export class PostsTagsService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  // public async getPostsByTag({
  //   tagName,
  //   cursor,
  //   limit = 20,
  //   userId,
  //   userself,
  // }: GetPostsByTagParams): Promise<Post[]> {
  //   return []
  // }

  public createTagsLoader(): DataLoader<string, any> {
    return new DataLoader(async (postIds: readonly string[]) => {
      const postsTags = await this.db.postTag.findMany({
        where: {
          fk_post_id: {
            in: postIds as string[],
          },
        },
        include: {
          tag: true,
        },
        orderBy: [
          { fk_post_id: 'asc' },
          {
            tag: {
              name: 'asc',
            },
          },
        ],
      })
      return this.utils
        .groupById<Prisma.PostTagGetPayload<{ include: { tag: true } }>>(
          postIds as string[],
          postsTags,
          (pt) => pt.fk_post_id!,
        )
        .map((array) => array.map((pt) => pt.tag))
    })
  }
}

// type GetPostsByTagParams = {
//   tagName: string
//   cursor?: string
//   limit?: number
//   userId?: string
//   userself: boolean
// }
