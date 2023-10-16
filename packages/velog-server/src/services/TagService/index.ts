import DataLoader from 'dataloader'
import { DbService } from '@lib/db/DbService'
import { Prisma, Tag } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import { UtilsService } from '@lib/utils/UtilsService.js'

interface Service {
  findByNameFiltered(name: string): Promise<Tag | null>
  findById(tagId: string): Promise<Tag | null>
  tagLoader(): DataLoader<string, Tag[]>
}

@injectable()
@singleton()
export class TagService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public async findByNameFiltered(name: string): Promise<Tag | null> {
    return await this.db.tag.findFirst({
      where: {
        name_filtered: name,
      },
    })
  }
  public async findById(tagId: string): Promise<Tag | null> {
    return await this.db.tag.findUnique({
      where: {
        id: tagId,
      },
    })
  }
  public tagLoader() {
    return this.createTagsLoader()
  }
  private createTagsLoader(): DataLoader<string, Tag[]> {
    return new DataLoader(async (postIds) => {
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
        .map((array) => array.map((pt) => pt.tag!))
    })
  }
}
