import 'reflect-metadata'

import { ENV } from '@env'
import { disableKeepAlive } from '@plugins/encapsulated/closePlugin.js'
import app from './app.js'
import { container } from 'tsyringe'
import { DbService } from '@lib/db/DbService.js'
import { RedisService } from '@lib/redis/RedisService.js'

async function main() {
  app.listen({ port: ENV.port, host: '::' })

  const dbService = container.resolve(DbService)
  await dbService.$connect()

  const redis = container.resolve(RedisService)
  await redis.connection().then((message) => console.log(message))

  console.info(`INFO: Database connected to "${ENV.databaseUrl.split('@')[1]}"`)
  process.on('SIGINT', async () => {
    disableKeepAlive()
    process.exit(0)
  })
}

main()
