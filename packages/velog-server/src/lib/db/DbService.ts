import { ENV } from '@env'
import { PrismaClient } from '@prisma/velog-rds/client/index.js'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class DbService extends PrismaClient {}
