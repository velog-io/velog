import { PrismaClient } from '@prisma/client'
import { injectable } from 'tsyringe'

@injectable()
export class DbService extends PrismaClient {}
