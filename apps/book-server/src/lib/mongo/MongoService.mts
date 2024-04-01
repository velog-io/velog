import { injectable, singleton } from 'tsyringe'
import { PrismaClient } from '@packages/database/src/velog-book-mongo.mjs'

@injectable()
@singleton()
export class MongoService extends PrismaClient {}
