import 'reflect-metadata'
import { ENV } from '@env'
import app from './app.js'
import { container } from 'tsyringe'
import { startClosing } from '@plugins/global/keepAlivePlugin.js'
import { DbService } from '@lib/db/DbService.js'

async function main() {
  app.listen({ port: ENV.port, host: '::' })
  const dbService = container.resolve(DbService)
  await dbService.$connect()
  console.info(`INFO: Database connected to "${ENV.databaseUrl}"`)

  process.send?.('ready')
  process.on('SIGINT', function () {
    startClosing()
    process.exit(0)
  })
}

main()
