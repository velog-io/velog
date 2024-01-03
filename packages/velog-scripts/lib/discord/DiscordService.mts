import { injectable, singleton } from 'tsyringe'
import { Client, GatewayIntentBits, Partials, type Channel } from 'discord.js'
import { ENV } from '../../env/env.mjs'

@injectable()
@singleton()
export class DiscordService {
  private client: Client
  construct() {
    console.log('실행')
    this.client = new Client({
      intents: [GatewayIntentBits.MessageContent],
    })

    this.client.on('ready', () => {
      console.log('Discord Client ready!')
    })

    this.client.login(ENV.discordBotToken)
  }
  public async sendMessage(channelId: string, message: string) {
    console.log('this.', this.client)
    this.client.on('ready', () => {
      console.log('hello')
    })
    this.client.login(ENV.discordBotToken)
  }
}
