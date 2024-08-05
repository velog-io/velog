import { injectable, singleton } from 'tsyringe'
import { PrismaClient } from '@packages/database/velog-book-mongo'
import { ENV } from '@env'

@injectable()
@singleton()
export class MongoService extends PrismaClient {
  constructor() {
    super({ datasourceUrl: ENV.mongoUrl })
  }
}
