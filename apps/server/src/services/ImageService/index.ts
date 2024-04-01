import { ENV } from '@env'
import { DbService } from '@lib/db/DbService.js'
import { SlackService } from '@lib/slack/SlackService.js'
import { UserImageNext } from '@packages/database/src/velog-rds.mjs'
import { UserService } from '@services/UserService/index.js'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getImagesOf(postId: string): Promise<UserImageNext[]>
  untrackPastImages(userId: string): Promise<void>
  trackImages(images: UserImageNext[], body: string): Promise<UserImageNext[]>
  untrackImagesOfDeletedPost(postId: string): Promise<UserImageNext[]>
  detectAbuse(userId: string): Promise<boolean>
}

@injectable()
@singleton()
export class ImageService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly slack: SlackService,
    private readonly userService: UserService,
  ) {}
  public async getImagesOf(postId: string) {
    const images = await this.db.userImageNext.findMany({
      where: {
        ref_id: postId,
      },
    })
    return images
  }

  public async untrackPastImages(userId: string) {
    const images = await this.db.userImageNext.findMany({
      where: {
        type: 'profile',
        tracked: true,
        fk_user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    if (images.length < 2) return

    // remove first one
    const imageIds = images.slice(1).map((image) => image.id)

    await this.db.userImageNext.updateMany({
      where: {
        id: {
          in: imageIds,
        },
      },
      data: {
        tracked: false,
      },
    })
  }

  public async trackImages(images: UserImageNext[], body: string) {
    const promises = images.map(async (image) => {
      const tracked = body.includes(image.id)
      return await this.db.userImageNext.update({
        where: {
          id: image.id,
        },
        data: {
          ...image,
          tracked,
        },
      })
    })

    return await Promise.all(promises)
  }
  public async untrackImagesOfDeletedPost(postId: string) {
    const images = await this.db.userImageNext.findMany({
      where: {
        type: 'post',
        ref_id: postId,
      },
    })
    console.log(`Untracking ${images.length} images of post ${postId}`)

    return await this.db.$transaction(
      images.map((image) => {
        return this.db.userImageNext.update({
          where: { id: image.id },
          data: { tracked: false },
        })
      }),
    )
  }
  public async detectAbuse(userId: string) {
    const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60)
    const oneMinuteAgo = new Date(Date.now() - 1000 * 60)

    const imageCountLastHour = await this.db.userImageNext.count({
      where: {
        fk_user_id: userId,
        created_at: {
          gt: oneHourAgo,
        },
      },
    })

    const user = await this.userService.findById(userId)
    const username = user?.username
    if (imageCountLastHour > 100) {
      this.slack.sendSlackMessage(
        `User ${username} (${userId}) has uploaded ${imageCountLastHour} images in the last hour.`,
        ENV.slackImage,
      )

      if (imageCountLastHour > 500) {
        this.slack.sendSlackMessage(
          `User ${username} (${userId}) is blocked due to upload abuse.`,
          ENV.slackImage,
        )
        return true
      }
    }

    const imageCountLastMinute = await this.db.userImageNext.count({
      where: {
        fk_user_id: userId,
        created_at: {
          gt: oneMinuteAgo,
        },
      },
    })

    if (imageCountLastMinute >= 20) {
      this.slack.sendSlackMessage(
        `User ${username} (${userId}) is blocked due to uploading ${imageCountLastMinute} images in a minute.`,
        ENV.slackImage,
      )
      return true
    }

    return false
  }
}
