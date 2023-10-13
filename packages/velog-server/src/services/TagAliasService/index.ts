import { DbService } from '@lib/db/DbService'
import { UtilsService } from '@lib/utils/UtilsService'
import { Tag, TagAlias } from '@prisma/client'
import { TagService } from '@services/TagService'
import { container, injectable, singleton } from 'tsyringe'

interface Service {
  findByTagId(tagId: string): Promise<TagAlias | null>
}

@injectable()
@singleton()
export class TagAliasService implements Service {
  constructor(private readonly db: DbService) {}
  static async getOriginTag(name: string): Promise<Tag | null> {
    const utils = container.resolve(UtilsService)
    const nameFiltered = utils.escapeForUrl(name).toLowerCase()
    const tagRepo = container.resolve(TagService)
    const tag = await tagRepo.findByNameFiltered(nameFiltered)

    if (!tag) return null
    if (!tag.is_alias) return tag

    const tagAliasRepo = container.resolve(TagAliasService)
    const alias = await tagAliasRepo.findByTagId(tag.id)
    if (!alias) return null
    return tagRepo.findById(alias.fk_alias_tag_id)
  }
  public async findByTagId(tagId: string): Promise<TagAlias | null> {
    return await this.db.tagAlias.findFirst({
      where: { fk_tag_id: tagId },
    })
  }
}
