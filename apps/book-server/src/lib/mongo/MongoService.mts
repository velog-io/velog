import { injectable, singleton } from 'tsyringe'
import { PrismaClient } from '@packages/database/velog-book-mongo'

@injectable()
@singleton()
export class MongoService extends PrismaClient {}
