import { PrismaClient } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export class DbService extends PrismaClient {}
