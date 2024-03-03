import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Tag } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  syncPostTags(postId: string, tags: Tag[]): Promise<void>
}

@injectable()
@singleton()
export class PostTagService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public async syncPostTags(postId: string, tags: Tag[]): Promise<void> {
    const uniqueTagIds = new Set(tags.map((tag) => tag.id))
    const uniqueTags = tags.filter((tag) => uniqueTagIds.has(tag.id) && uniqueTagIds.delete(tag.id))

    const prevPostTags = await this.db.postTag.findMany({
      where: {
        fk_post_id: postId,
      },
    })

    const normalized = {
      prev: this.utils.normalize(prevPostTags, (postTag) => postTag.fk_tag_id!),
      current: this.utils.normalize(uniqueTags),
    }

    // removes tags that are missing
    const missingPostTagIds = prevPostTags
      .filter((postTag) => !normalized.current[postTag.fk_tag_id!])
      .map((postTag) => postTag.id)

    await this.db.postTag.deleteMany({
      where: {
        id: {
          in: missingPostTagIds,
        },
      },
    })

    const tagsToAddData = uniqueTags
      .filter((tag) => !normalized.prev[tag.id])
      .map((tag) => ({
        fk_post_id: postId,
        fk_tag_id: tag.id,
      }))

    try {
      await this.db.postTag.createMany({
        data: tagsToAddData,
      })
    } catch (_) {}
  }
}
