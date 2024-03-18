import 'reflect-metadata'
import app from './app.mjs'
import { EnvService } from '@lib/env/EnvService.mjs'
import { container } from 'tsyringe'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { DiscordService } from '@lib/discord/DiscordService.mjs'

async function main() {
  const env = container.resolve(EnvService)

  const mongo = container.resolve(MongoService)
  await mongo.$connect()
  console.info(`Mongo database connection established to ${env.get('mongoUrl')}`)

  const discord = container.resolve(DiscordService)
  discord.connection()

  const port = env.get('port')
  app.listen({ port, host: '::' })
}

main()
