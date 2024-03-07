import { injectable, singleton } from 'tsyringe'
import { PrismaClient } from '@prisma/velog-book-mongo/client/index.js'

@injectable()
@singleton()
export class MongoService extends PrismaClient {}
