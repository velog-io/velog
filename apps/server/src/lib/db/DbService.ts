import { ENV } from '@env'
import { PrismaClient } from '@packages/database/velog-rds'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class DbService extends PrismaClient {
  constructor() {
    super({
      datasourceUrl: ENV.databaseUrl,
    })
  }
}
