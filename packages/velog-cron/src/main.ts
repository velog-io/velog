import 'reflect-metadata'
import { ENV } from '@env'
import app from './app.js'

async function main() {
  app.listen({ port: ENV.port })

  process.send?.('ready')
  console.info(`CRON server started on ${ENV.port}`)
}

main()
