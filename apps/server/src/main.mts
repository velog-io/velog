import 'reflect-metadata'
import { ENV } from 'src/env.mjs'
import app from './app.mjs'
import { container } from 'tsyringe'
import { startClosing } from '@plugins/global/keepAlivePlugin.mjs'
import { DbService } from '@lib/db/DbService.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { DiscordService } from '@lib/discord/DiscordService.js'

async function main() {
  app.listen({ port: ENV.port, host: '::' })

  const dbService = container.resolve(DbService)
  await dbService.$connect()

  const redis = container.resolve(RedisService)
  await redis.connection().then((message) => console.log(message))

  const discord = container.resolve(DiscordService)
  await discord.connection()

  console.info(`INFO: Database connected to "${ENV.databaseUrl.split('@')[1]}"`)
  console.info(`INFO: Redis connected to "${ENV.redisHost}:${ENV.redisPort}"`)

  process.send?.('ready')
  process.on('SIGINT', function () {
    startClosing()
    process.exit(0)
  })
}

main()
