import 'reflect-metadata'

import { ENV } from '@env'
import { disableKeepAlive } from '@plugins/encapsulated/closePlugin.js'
import app from './app.js'

async function main() {
  app.listen({ port: ENV.port })

  process.on('SIGINT', async () => {
    disableKeepAlive()
    process.exit(0)
  })
}

main()
