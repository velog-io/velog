import { injectable, singleton, container } from 'tsyringe'
import { MongoClient } from 'mongodb'
import { EnvService } from '@lib/env/EnvService.mjs'

@injectable()
@singleton()
export class MongoService extends MongoClient {
  constructor() {
    const env = container.resolve(EnvService)
    super(env.get('mongoUrl'))
  }
}
