import { ENV } from '@env'
import { PrismaClient } from '@prisma/velog-rds/client'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class DbService extends PrismaClient {
  constructor() {
    super({ datasources: { db: { url: ENV.databaseUrl } } })
  }
}
