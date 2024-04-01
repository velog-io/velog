import { PrismaClient } from '@packages/database/src/velog-rds.mjs'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class DbService extends PrismaClient {}
