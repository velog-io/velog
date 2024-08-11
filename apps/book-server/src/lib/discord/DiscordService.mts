import { ENV } from '@env'
import { DiscordService as Discord } from '@packages/library/discord'
import { injectable, singleton } from 'tsyringe'

type Channel = {
  error: string
  image: string
}

@injectable()
@singleton()
export class DiscordService extends Discord<keyof Channel> {
  constructor() {
    super({
      discordBotToken: ENV.discordBotToken,
      channels: {
        error: ENV.discordErrorChannel,
        image: ENV.discordImageChannel,
      },
    })
  }
}
