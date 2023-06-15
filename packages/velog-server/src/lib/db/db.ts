import { PrismaClient } from '@prisma/client'
import { injectable } from 'tsyringe'

@injectable()
export class Db extends PrismaClient {}
