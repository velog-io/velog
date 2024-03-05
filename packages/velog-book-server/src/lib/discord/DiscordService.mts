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
  public sendMessage(type: MessageType, message: string) {
    this.isSending = true
    return new Promise(async (resolve, reject) => {
      const frequentWord = ['connection pool', 'canceling statement', 'Not allow origin']
      const isFrequentWordIncluded = frequentWord.some((word) => message.includes(word))

      if (isFrequentWordIncluded) {
        resolve('Frequent word included skip sending message')
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
          await channel.send(message)
        } else {
          throw new Error('Wrong channel type')
        }

        resolve('Message sent successfully!')
      } catch (error) {
        reject('Failed to send meesage')
        throw error
      } finally {
        this.isSending = false
      }
    })
  }
}

type MessageType = 'error'
