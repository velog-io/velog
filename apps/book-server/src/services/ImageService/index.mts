import { Time } from '@constants/TimeConstants.mjs'
import { DiscordService } from '@lib/discord/DiscordService.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { WriterService } from '@services/WriterService/index.mjs'
import { injectable, singleton } from 'tsyringe'

interface Service {
  detectAbuse(signedWriterId: string): Promise<boolean>
}

@injectable()
@singleton()
export class ImageService implements Service {
  constructor(
    private readonly mongo: MongoService,
    private readonly discord: DiscordService,
    private readonly writerService: WriterService,
  ) {}
  async detectAbuse(writerId: string): Promise<boolean> {
    const oneHourAgo = new Date(Date.now() - Time.ONE_HOUR_IN_MS)
    const oneMinuteAgo = new Date(Date.now() - Time.ONE_MINUTE_IN_MS)

    const imageCountLastHour = await this.mongo.image.count({
      where: {
        fk_writer_id: writerId,
        created_at: {
          gt: oneHourAgo,
        },
      },
    })

    const writer = await this.writerService.findById(writerId)
    if (!writer) return true

    if (imageCountLastHour > 150) {
      const message = `User ${writer.username} (${writerId}) is blocked due to upload abuse.`
      this.discord.sendMessage('image', message)
      return true
    }

    if (imageCountLastHour > 100) {
      const message = `User ${writer.username} (${writerId}) has uploaded ${imageCountLastHour} images in the last hour.`
      this.discord.sendMessage('image', message)
      return true
    }

    const imageCountLastMinute = await this.mongo.image.count({
      where: {
        fk_writer_id: writerId,
        created_at: {
          gt: oneMinuteAgo,
        },
      },
    })

    if (imageCountLastMinute >= 20) {
      const message = `User ${writer.username} (${writerId}) is blocked due to uploading ${imageCountLastMinute} images in a minute.`
      this.discord.sendMessage('image', message)
      return true
    }

    return false
  }
}
