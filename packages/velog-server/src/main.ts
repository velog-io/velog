import 'reflect-metadata'
import app from './app.js'
import { ENV } from './env.js'
import { container } from 'tsyringe'
import { startClosing } from '@plugins/global/keepAlivePlugin.js'
import { DbService } from '@lib/db/dbService.js'

async function main() {
  const dbService = container.resolve(DbService)

  await dbService.$connect()
  app.listen({ port: ENV.port })

  process.send?.('ready')

  console.info(`INFO: Database connected to "${ENV.databaseUrl}"`)
  process.on('SIGINT', function () {
    startClosing()
    process.exit(0)
  })
}

main()
