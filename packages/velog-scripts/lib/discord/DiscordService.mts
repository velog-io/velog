import { injectable, singleton } from 'tsyringe'
import { Client, GatewayIntentBits } from 'discord.js'
import { ENV } from '../../env/env.mjs'

@injectable()
@singleton()
export class DiscordService {
  private client!: Client
  construct() {}
  public connection(): Promise<Client> {
    return new Promise((resolve) => {
      this.client = new Client({
        intents: [GatewayIntentBits.MessageContent],
      })

      this.client.on('ready', () => {
        console.log('Discord Client ready!')
        resolve(this.client)
      })

      this.client.login(ENV.discordBotToken)
    })
  }
  public sendMessage(channelId: string, message: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const isReady = this.client.isReady()

        if (!isReady) {
          throw new Error('Discord bot is not ready')
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
      }
    })
  }
}
