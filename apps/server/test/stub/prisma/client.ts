import { PrismaClient } from '@packages/database/src/velog-rds.mjs'

const prisma = new PrismaClient()
export default prisma
