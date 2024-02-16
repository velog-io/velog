import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { EditPostInput, WritePostInput } from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { injectable, singleton } from 'tsyringe'
import geoIp from 'geoip-country'
import { customAlphabet } from 'nanoid'
import { TagService } from '@services/TagService/index.js'
import { PostTagService } from '@services/PostTagService'

interface Service {}

@injectable()
@singleton()
export class PostWriteService implements Service {
  constructor(
    private readonly utils: UtilsService,
    private readonly db: DbService,
    private readonly tagService: TagService,
    private readonly postTagService: PostTagService,
  ) {}
  private checkAuthentication(userId: string) {
    if (!userId) {
      throw new UnauthorizedError('Not logged in')
    }
  }
  private isIncludeSpamWord(args: PostArgs, ctx: any, extraText: string): boolean {
    const allowList = ['KR', 'GB', '']
    const blockList = ['IN', 'PK', 'CN', 'VN', 'TH', 'PH']
    const country = geoIp.lookup(ctx.ip)?.country ?? ''
    const isForeign = !allowList.includes(country)

    if (
      blockList.includes(country) ||
      this.utils.spamFilter(args.body!.concat(extraText), isForeign) ||
      this.utils.spamFilter(args.title!, isForeign, true)
    ) {
      // post.is_private = true
      // const message = {
      //   text: `Spam suspicion!\n*userId*: ${ctx.user_id}\ntitle: ${post.title}, ip: ${ctx.ip}, country: ${country}`,
      // }
      return true
    }
    return false
  }
  private async generateUrlSlug(args: PostArgs, urlSlug: string, userId: string) {
    let processedUrlSlug = this.utils.escapeForUrl(urlSlug)
    const urlSlugDuplicate = await this.db.post.findFirst({
      where: {
        fk_user_id: userId,
        url_slug: processedUrlSlug,
      },
    })

    const generate = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 8)
    const isEditArgs = this.isEditArgs(args)

    if (isEditArgs && urlSlugDuplicate && urlSlugDuplicate.id !== args.id) {
      const randomString = generate(8)
      processedUrlSlug += `-${randomString}`
    }

    if (!isEditArgs && urlSlugDuplicate) {
      const randomString = generate(8)
      processedUrlSlug += `-${randomString}`
    }

    if (!processedUrlSlug) {
      processedUrlSlug = generate(8)
    }

    return processedUrlSlug
  }
  private isEditArgs(args: any): args is EditPostInput {
    if (!args.id) return true
    return false
  }
  async handleTags(args: PostArgs, postId: string) {
    const tagsData = await Promise.all(args.tags.map(this.tagService.findOrCreate))
    await this.postTagService.syncPostTags(postId, tagsData)
  }
}

type PostArgs = WritePostInput | EditPostInput
