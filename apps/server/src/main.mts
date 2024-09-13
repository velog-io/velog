import 'reflect-metadata'
import { ENV } from './env.mjs'
import app from './app.mjs'
import { container } from 'tsyringe'
import { startClosing } from '@plugins/global/keepAlivePlugin.mjs'
import { DbService } from '@lib/db/DbService.js'
import { RedisService } from '@lib/redis/RedisService.js'
import { DiscordService } from '@lib/discord/DiscordService.js'
import { ElasticSearchService } from '@lib/elasticSearch/ElasticSearchService.js'

async function main() {
  app.listen({ port: ENV.port, host: '::' })

  const dbService = container.resolve(DbService)
  await dbService.connection()

  const redis = container.resolve(RedisService)
  await redis.connection()

  const discord = container.resolve(DiscordService)
  await discord.connection()

  const elasticSearch = container.resolve(ElasticSearchService)
  elasticSearch.connection()

  process.send?.('ready')
  process.on('SIGINT', function () {
    startClosing()
    process.exit(0)
  })
}

main()
