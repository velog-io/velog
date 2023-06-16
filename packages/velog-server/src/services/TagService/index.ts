import { DbService } from '@lib/db/DbService'
import { Tag } from '@prisma/client'
import { injectable } from 'tsyringe'

interface Service {
  findByNameFiltered(name: string): Promise<Tag | null>
  findById(tagId: string): Promise<Tag | null>
}

@injectable()
export class TagService implements Service {
  constructor(private readonly db: DbService) {}
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
}
