import { PrismaClient } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

@injectable()
@singleton()
export class DbService extends PrismaClient {
  constructor() {
    super()
  }
  async $connect() {
    console.log('sleep...')
    await sleep(3000)
  }
}
