import { EditPostInput, WritePostInput } from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { injectable, singleton } from 'tsyringe'
import { customAlphabet } from 'nanoid'
import { TagService } from '@services/TagService/index.js'
import { PostTagService } from '@services/PostTagService/index.js'
import { Time } from '@constants/TimeConstants.js'
import { DiscordService } from '@lib/discord/DiscordService.js'
import { CurrentUser } from '@interfaces/user'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { BadRequestError } from '@errors/BadRequestErrors.js'
import geoip from 'geoip-country'
import { Post, Series, Tag } from '@prisma/client'
import { RestrictionService } from '@services/RestrictionService/index.js'
import { ForbiddenError } from '@errors/ForbiddenError.js'
import { SeriesService } from '@services/SeriesService/index.js'
import { SearchService } from '@services/SearchService/index.js'
import { ExternalIntegrationService } from '@services/ExternalIntegrationService/index.js'
import { PostService } from '@services/PostService/index.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { GraphcdnService } from '@lib/graphcdn/GraphcdnService.js'
import { ImageService } from '@services/ImageService/index.js'

interface Service {
  write(input: WritePostInput, sigedUserId: string, ip: string): Promise<Post>
}

@injectable()
@singleton()
export class PostWriteService implements Service {
  constructor(
    private readonly utils: UtilsService,
    private readonly db: DbService,
    private readonly discord: DiscordService,
    private readonly redis: RedisService,
    private readonly graphcdn: GraphcdnService,
    private readonly restirctionService: RestrictionService,
    private readonly tagService: TagService,
    private readonly postTagService: PostTagService,
    private readonly postService: PostService,
    private readonly seriesService: SeriesService,
    private readonly searchService: SearchService,
    private readonly externalInterationService: ExternalIntegrationService,
    private readonly imageService: ImageService,
  ) {}
  public async write(input: WritePostInput, signedUserId: string, ip: string): Promise<Post> {
    const { token, ...postArgs } = input

    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const user = await this.db.user.findUnique({
      where: {
        id: signedUserId,
      },
      include: {
        profile: true,
      },
    })

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    if (this.utils.checkEmpty(input.title)) {
      throw new BadRequestError('Title is empty')
    }

    const country = geoip.lookup(ip)?.country ?? ''
    const isIncludeSpam = this.isIncludeSpamKeyword({ input, user, country })
    const isPostLimitReached = await this.isPostLimitReached(signedUserId)
    const isBlockedUser = await this.restirctionService.checkBlockedUser(user.username)

    const checked = [isIncludeSpam, isPostLimitReached, isBlockedUser]
    if (checked.some((check) => check)) {
      postArgs.is_private = true
      await this.alertIsSpam({
        userId: user.id,
        title: input.title!,
        country,
        ip,
      })
    }

    const processedUrlSlug = await this.generateUrlSlug({
      input,
      urlSlug: input.url_slug,
      userId: signedUserId,
    })

    postArgs.url_slug = processedUrlSlug

    if (postArgs.series_id && !postArgs.is_temp) {
      await this.checkSeriesOwnership(postArgs.series_id, signedUserId)
    }

    const post = await this.db.post.create({
      data: {
        ...postArgs,
        fk_user_id: signedUserId,
      },
    })

    if (postArgs.series_id && !postArgs.is_temp) {
      await this.seriesService.appendToSeries(postArgs.series_id, post.id)
    }

    await this.handleTags(postArgs, post.id)

    if (!postArgs.is_temp) {
      await this.searchService.searchSync.update(post.id)
    }

    const isPublish = !postArgs.is_temp && !postArgs.is_private
    if (isPublish) {
      setImmediate(async () => {
        if (!signedUserId) return
        const isIntegrated = await this.externalInterationService.checkIntegrated(signedUserId)
        if (!isIntegrated) return
        const targetPost = await this.db.post.findUnique({
          where: {
            id: post.id,
          },
          include: {
            postTags: {
              include: {
                tag: true,
              },
            },
            user: true,
          },
        })
        if (!targetPost) return
        const serializedPost = this.postService.serialize(targetPost)
        this.externalInterationService.notifyWebhook({
          type: 'created',
          post: serializedPost,
        })
      })

      const queueData = {
        fk_following_id: signedUserId,
        fk_post_id: post.id,
      }
      await this.redis.createFeedQueue(queueData)
    }

    this.graphcdn.purgeRecentPosts()
    this.graphcdn.purgeUser(signedUserId)

    setTimeout(async () => {
      const images = await this.imageService.getImagesOf(post.id)
      await this.imageService.trackImages(images, postArgs.body)
    }, 0)

    return post
  }
  private isIncludeSpamKeyword({ input, user, country }: IsIncludeSpamKeywordArgs): boolean {
    const extraText = input.tags
      .join('')
      .concat(user?.profile?.short_bio ?? '', user?.profile?.display_name ?? '')

    const allowList = ['KR', 'GB', '']
    const blockList = ['IN', 'PK', 'CN', 'VN', 'TH', 'PH']
    const isForeign = !allowList.includes(country)

    if (
      blockList.includes(country) ||
      this.utils.spamFilter(input.body!.concat(extraText), isForeign) ||
      this.utils.spamFilter(input.title!, isForeign, true)
    ) {
      return true
    }
    return false
  }
  private async generateUrlSlug({ input, urlSlug, userId }: GenerateUrlSlugArgs) {
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
  private async handleTags(input: PostInput, postId: string): Promise<Tag[]> {
    const tagsData = await Promise.all(input.tags.map(this.tagService.findOrCreate))
    await this.postTagService.syncPostTags(postId, tagsData)
    return tagsData
  }
  private async isPostLimitReached(signedUserId: string): Promise<boolean> {
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
    await this.db.post.updateMany({
      where: {
        fk_user_id: signedUserId,
        released_at: {
          gt: new Date(Date.now() - Time.ONE_MINUTE_IN_MS * 5),
        },
      },
      data: {
        is_private: true,
      },
    })

    return true
  }
  private async alertIsSpam({ userId, title, ip, country }: AlertSpam): Promise<void> {
    const message = {
      text: `스팸 의심 (수정) !\n *userId*: ${userId}\ntitle: ${title}, ip: ${ip}, country: ${country}`,
    }
    await this.discord.sendMessage('spam', JSON.stringify(message))
  }
  private async checkSeriesOwnership(series_id: string, signedUserId: string): Promise<Series> {
    const series = await this.db.series.findUnique({
      where: {
        id: series_id,
      },
    })
    if (!series) {
      throw new NotFoundError('Not found series')
    }

    if (series.fk_user_id !== signedUserId) {
      throw new ForbiddenError('This series is not yours')
    }

    return series
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
  user: CurrentUser
  country: string
}

type GenerateUrlSlugArgs = {
  input: PostInput
  urlSlug: string
  userId: string
}
