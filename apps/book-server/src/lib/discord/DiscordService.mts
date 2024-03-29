import { injectable, singleton } from 'tsyringe'
import { Client, GatewayIntentBits } from 'discord.js'
import { EnvService } from '@lib/env/EnvService.mjs'

@injectable()
@singleton()
export class DiscordService {
  private client!: Client
  public isSending: boolean = false
  constructor(private readonly env: EnvService) {}
  public connection(): Promise<Client> {
    return new Promise((resolve) => {
      this.client = new Client({
        intents: [GatewayIntentBits.MessageContent],
      })

      this.client.on('ready', () => {
        console.log('Discord Client ready')
        resolve(this.client)
      })

      this.client.login(this.env.get('discordBotToken'))
    })
  }
  public async sendMessage(type: MessageType, message: string) {
    this.isSending = true

    const frequentWord: string[] = []
    const isFrequentWordIncluded = frequentWord.some((word) => message.includes(word))

    if (isFrequentWordIncluded) {
      this.isSending = false
      console.log('Frequent word included skip sending message')
      return
    }

    try {
      const isReady = this.client.isReady()

      if (!isReady) {
        throw new Error('Discord bot is not ready')
      }

      const channelMapper: Record<MessageType, string> = {
        error: this.env.get('discordErrorChannel'),
      }

      const channelId = channelMapper[type]

      if (!channelId) {
        throw new Error('Not found discord channel id')
      }

      const channel = await this.client.channels.fetch(channelId)

      if (channel?.isTextBased()) {
        const chunkSize = 2000
        for (let i = 0; i < message.length; i += chunkSize) {
          const chunk = message.slice(i, i + chunkSize)
          await channel.send(chunk)
        }
      } else {
        throw new Error('Wrong channel type')
      }
    } catch (error: any) {
      console.log(error)
      throw new Error('Failed to send meesage to discord channel')
    } finally {
      this.isSending = false
    }
  }
}

type MessageType = 'error'
