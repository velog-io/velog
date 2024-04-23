import { PrismaClient } from '@packages/database/velog-rds'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class DbService extends PrismaClient {
  constructor() {
    super({ datasourceUrl: process.env.DATABASE_URL })
  }
}
