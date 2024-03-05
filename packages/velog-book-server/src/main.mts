import 'reflect-metadata'
import { EnvService } from '@lib/env/EnvService.mjs'
import { container } from 'tsyringe'
import app from './app.mjs'
import { MongoService } from '@lib/mongo/MongoService.mjs'

async function main() {
  const env = container.resolve(EnvService)
  env.init()

  const mongo = container.resolve(MongoService)

  await mongo.$connect()
  console.info(`Mongo database connection established to ${env.get('mongoUrl')}`)

  const port = env.get('port')
  app.listen({ port, host: '::' })
}

main()
