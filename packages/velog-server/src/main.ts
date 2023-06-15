import 'reflect-metadata'
import { Db } from '@lib/db/db.js'
import app from './app.js'
import { ENV } from './env.js'
import { container } from 'tsyringe'
import { startClosing } from '@common/plugins/global/keepAlive.plugin.js'

async function bootstrap() {
  const dbService = container.resolve(Db)

  await dbService.$connect()
  app.listen({ port: ENV.port })

  process.send?.('ready')

  console.info(`INFO: Database connected to "${ENV.databaseUrl}"`)
  process.on('SIGINT', function () {
    startClosing()
    process.exit(0)
  })
}

bootstrap()
