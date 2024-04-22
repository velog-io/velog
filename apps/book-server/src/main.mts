import 'reflect-metadata'
import app from './app.mjs'
import { container } from 'tsyringe'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { DiscordService } from '@lib/discord/DiscordService.mjs'
import { ENV } from '@env'

async function main() {
  const mongo = container.resolve(MongoService)
  await mongo.$connect()
  console.info(`Mongo database connection established to ${ENV.mongoUrl}`)

  const discord = container.resolve(DiscordService)
  discord.connection()

  app.listen({ port: ENV.port, host: '::' })
}

main()
