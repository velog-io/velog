import { PrismaClient } from '@packages/database/src/velog-rds/index.mjs'

const prisma = new PrismaClient()
export default prisma
