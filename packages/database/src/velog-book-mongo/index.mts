import type { PrismaClientOptions } from '@prisma/client/runtime/library'
import { PrismaClient as Client } from '@prisma/velog-book-mongo/client/index.js'
export * from '@prisma/velog-book-mongo/client/index.js'

type Options = Omit<PrismaClientOptions, 'transactionOptions'>

export class PrismaClient extends Client {
  private datasourceUrl: string
  constructor(options: Options) {
    if (!options.datasourceUrl) throw new Error('velog book datasourceUrl is required')
    super(options)
    this.datasourceUrl = options.datasourceUrl
  }

  public async connection(): Promise<void> {
    await super.$connect()
    console.info(`INFO: Database connected to "${this.datasourceUrl.split('@')[1]}"`)
  }
}
