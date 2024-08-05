import 'reflect-metadata'
import app from './app.mjs'
import { container } from 'tsyringe'
import { MongoService } from '@lib/mongo/MongoService.mjs'
import { DiscordService } from '@lib/discord/DiscordService.mjs'
import { ENV } from '@env'
import { RedisService } from '@lib/redis/RedisService.mjs'

async function main() {
  const mongo = container.resolve(MongoService)
  await mongo.$connect()
  console.info(`Mongo database connection established to ${ENV.mongoUrl}`)

  const discord = container.resolve(DiscordService)
  discord.connection()

  const redis = container.resolve(RedisService)
  await redis.connection()

  app.listen({ port: ENV.port, host: '::' })
}

main()
