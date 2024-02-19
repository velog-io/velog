import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { EditPostInput, User, WritePostInput } from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { injectable, singleton } from 'tsyringe'
import { customAlphabet } from 'nanoid'
import { TagService } from '@services/TagService/index.js'
import { PostTagService } from '@services/PostTagService/index.js'
import { Time } from '@constants/TimeConstants.js'
import { DiscordService } from '@lib/discord/DiscordService.js'

interface Service {
  checkAuthentication(userId: string): void
  isIncludeSpamKeyword(args: IsIncludeSpamKeywordArgs): boolean
  generateUrlSlug(args: GenerateUrlSlugArgs): Promise<string>
  handleTags(input: PostInput, postId: string): Promise<void>
}

@injectable()
@singleton()
export class PostWriteService implements Service {
  constructor(
    private readonly utils: UtilsService,
    private readonly db: DbService,
    private readonly tagService: TagService,
    private readonly postTagService: PostTagService,
    private readonly discordService: DiscordService,
  ) {}
  public checkAuthentication(userId: string) {
    if (!userId) {
      throw new UnauthorizedError('Not logged in')
    }
  }
  public isIncludeSpamKeyword({ input, user, country, ip }: IsIncludeSpamKeywordArgs): boolean {
    const extraText = input.tags
      .join('')
      .concat(user?.profile.short_bio ?? '', user?.profile.display_name ?? '')

    const allowList = ['KR', 'GB', '']
    const blockList = ['IN', 'PK', 'CN', 'VN', 'TH', 'PH']
    const isForeign = !allowList.includes(country)

    if (
      blockList.includes(country) ||
      this.utils.spamFilter(input.body!.concat(extraText), isForeign) ||
      this.utils.spamFilter(input.title!, isForeign, true)
    ) {
      this.alertSpam({
        userId: user.id,
        title: input.title!,
        ip,
        country,
      })
      return true
    }
    return false
  }
  public async generateUrlSlug({ input, urlSlug, userId }: GenerateUrlSlugArgs) {
    let processedUrlSlug = this.utils.escapeForUrl(urlSlug)
    const urlSlugDuplicate = await this.db.post.findFirst({
      where: {
        fk_user_id: userId,
        url_slug: processedUrlSlug,
      },
    })

    const generate = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 8)
    const isEditArgs = this.isEditArgs(input)

    if (isEditArgs && urlSlugDuplicate && urlSlugDuplicate.id !== input.id) {
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
  public async handleTags(input: PostInput, postId: string) {
    const tagsData = await Promise.all(input.tags.map(this.tagService.findOrCreate))
    await this.postTagService.syncPostTags(postId, tagsData)
  }
  public async isPostLimitReached(signedUserId: string): Promise<boolean> {
    const recentPostCount = await this.db.post.count({
      where: {
        fk_user_id: signedUserId,
        is_private: false,
        released_at: {
          gt: new Date(Date.now() - Time.ONE_MINUTE_IN_MS * 5),
        },
      },
    })

    if (recentPostCount < 10) return false

    return true
  }
  private async alertSpam({ userId, title, ip, country }: AlertSpam): Promise<void> {
    const message = {
      text: `스팸 의심 (수정) !\n *userId*: ${userId}\ntitle: ${title}, ip: ${ip}, country: ${country}`,
    }
    await this.discordService.sendMessage('spam', JSON.stringify(message))
  }
}

type PostInput = WritePostInput | EditPostInput

type AlertSpam = {
  userId: string
  title: string
  ip: string
  country: string
}

type IsIncludeSpamKeywordArgs = {
  input: PostInput
  user: User
  ip: string
  country: string
}

type GenerateUrlSlugArgs = {
  input: PostInput
  urlSlug: string
  userId: string
}
