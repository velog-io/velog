import { DbService } from '@lib/db/DbService.js'
import { CheckPostSpamArgs } from '@lib/redis/RedisService.js'
import { Post, Prisma } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'
import geoip from 'geoip-country'
import { subMonths } from 'date-fns'
import { DiscordService } from '@lib/discord/DiscordService.js'
import { NotFoundError } from '@errors/NotfoundError.js'

interface Service {
  findById(postId: string): Promise<Post | null>
  scoreCalculator(postId: string): Promise<void>
  checkSpam(args: CheckPostSpamArgs): Promise<void>
}

@singleton()
@injectable()
export class PostService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly discord: DiscordService,
  ) {}

  public async findById(postId: string): Promise<Post | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
    })
    return post
  }

  public async findByUserId({ userId, ...queries }: FindByUserIdParams): Promise<Post[]> {
    const { where, ...query } = queries
    const posts = await this.db.post.findMany({
      where: {
        ...where,
        fk_user_id: userId,
      },
      ...query,
    })
    return posts
  }

  public async scoreCalculator(postId: string): Promise<void> {
    const post = await this.findById(postId)

    if (!post) {
      throw new Error('Not found Post')
    }

    const postLikes = await this.db.postLike.count({
      where: {
        fk_post_id: postId,
      },
    })

    const ONE_HOUR = 1000 * 60 * 60
    const itemHourAge = (Date.now() - post.released_at!.getTime()) / ONE_HOUR
    const gravity = 0.35
    const votes = postLikes + (post.views ?? 0) * 0.04

    const score = votes / Math.pow(itemHourAge + 2, gravity)

    await this.db.post.update({
      where: {
        id: post.id,
      },
      data: {
        score,
      },
    })
  }

  public async checkSpam({ post_id, user_id, ip }: CheckPostSpamArgs): Promise<void> {
    const post = await this.db.post.findUnique({
      where: {
        id: post_id,
      },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!post) {
      throw new NotFoundError('Not found Post')
    }

    const user = await this.db.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        profile: true,
      },
    })

    if (!user) {
      throw new NotFoundError('Not found User')
    }

    const country = geoip.lookup(ip)?.country ?? ''

    const extraText = post.postTags
      .flatMap((postTag) => postTag.tag)
      .map((tag) => tag?.name ?? '')
      .join('')
      .concat(user.profile?.short_bio ?? '', user.profile?.display_name ?? '')

    const isSpam = await this.checkIsSpam(post.title ?? '', post.body ?? '', extraText, country)

    if (!isSpam) return

    this.db.post.update({
      where: {
        id: post.id,
      },
      data: {
        is_private: true,
      },
    })

    const message = {
      text: `*userId*: ${user_id}\ntitle: ${post.title}, ip: ${ip}, country: ${country} type: isSpam`,
    }

    this.discord.sendMessage('spam', JSON.stringify(message))
  }
  private async checkIsSpam(
    title: string,
    body: string,
    extraText: string,
    country: string,
  ): Promise<boolean> {
    const allowList = ['KR', 'GB', '']
    const blockList = ['IN', 'PK', 'CN', 'VN', 'TH', 'PH']
    const isForeign = !allowList.includes(country)

    if (blockList.includes(country)) {
      return true
    }

    const checkTitle = await this.spamFilter(title!, isForeign, true)

    if (checkTitle) {
      return true
    }

    const checkBody = await this.spamFilter(body!.concat(extraText), isForeign)

    if (checkBody) {
      return true
    }

    return false
  }

  private async spamFilter(text: string, isForeign: boolean, isTitle = false): Promise<boolean> {
    const includesCN = /[\u4e00-\u9fa5]/.test(text)
    const includesKR = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)

    if (includesCN && !includesKR) {
      return true
    }

    let replaced = text.replace(/```([\s\S]*?)```/g, '') // remove code blocks
    // replace image markdown
    replaced = replaced.replace(/!\[([\s\S]*?)\]\(([\s\S]*?)\)/g, '')

    const alphanumericKorean = replaced
      .replace(/[^a-zA-Zㄱ-힣0-9 \n]/g, '') // remove non-korean
      .toLowerCase()

    const hasLink = /http/.test(replaced)

    if (!isTitle && isForeign && hasLink) {
      const lines = replaced.split('\n').filter((line) => line.trim().length > 1)
      const koreanLinesCount = lines.filter((line) => this.hasKorean(line)).length
      const confidence = koreanLinesCount / lines.length
      return confidence < 0.3
    }

    const spaceReplaced = alphanumericKorean.replace(/\s/g, '')

    const oneMonthAgo = subMonths(new Date(), 1)
    const bannedKeywords = await this.db.dynamicConfigItem.findMany({
      where: {
        type: 'bannedKeyword',
        last_used_at: {
          gte: oneMonthAgo,
        },
      },
    })

    const removeDuplicated = Array.from(
      new Set([text, alphanumericKorean, spaceReplaced].join(',').split(' ')),
    )
    const keywordsToUpdate: string[] = []

    const checkKeyword = bannedKeywords
      .map((keyword) => keyword.value)
      .some((keyword) => {
        if (removeDuplicated.includes(keyword)) {
          keywordsToUpdate.push(keyword)
          return true
        } else {
          return false
        }
      })

    if (keywordsToUpdate.length > 0) {
      this.db.dynamicConfigItem.updateMany({
        where: {
          value: {
            in: keywordsToUpdate,
          },
        },
        data: {
          last_used_at: new Date(),
          usage_count: {
            increment: 1,
          },
        },
      })
    }

    if (checkKeyword) {
      return true
    }

    const bannedAltKeywords = await this.db.dynamicConfigItem.findMany({
      where: {
        type: 'bannedAltKeyword',
      },
    })

    const score = bannedAltKeywords
      .map(({ value }) => value)
      .reduce((acc, current) => {
        if (alphanumericKorean.includes(current)) {
          return acc + 1
        }
        return acc
      }, 0)

    if (score >= 2 && isForeign) {
      return true
    }
    return false
  }
  private hasKorean(text: string) {
    return /[ㄱ-힣]/g.test(text)
  }
}

type FindByUserIdParams = {
  userId: string
} & Prisma.PostFindManyArgs
