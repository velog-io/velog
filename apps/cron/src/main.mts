import 'reflect-metadata'
import { ENV } from '@env'
import { disableKeepAlive } from '@plugins/encapsulated/closePlugin.mjs'
import app from './app.mjs'
import { container } from 'tsyringe'
import { DbService } from '@lib/db/DbService.mjs'
import { RedisService } from '@lib/redis/RedisService.mjs'
import { DiscordService } from '@lib/discord/DiscordService.mjs'

async function main() {
  const discord = container.resolve(DiscordService)
  await discord.connection()

  const dbService = container.resolve(DbService)
  await dbService.$connect()

  const redis = container.resolve(RedisService)
  await redis.connection()

  console.info(`INFO: Database connected to "${ENV.databaseUrl.split('@')[1]}"`)
  process.on('SIGINT', async () => {
    disableKeepAlive()
    process.exit(0)
  })

  app.listen({ port: ENV.port, host: '::' })
}

await main()
