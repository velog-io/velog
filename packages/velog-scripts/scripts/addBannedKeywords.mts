import 'reflect-metadata'
import { ENV } from '../env/env.mjs'
import { DbService } from '../lib/db/DbService.mjs'
import { container, injectable, singleton } from 'tsyringe'

@singleton()
@injectable()
class Runner {
  constructor(private readonly db: DbService) {}
  public async run(bannedKeywords: string[]) {
    const data = bannedKeywords.map((value) => ({
      value,
      type: 'banned',
    }))

    try {
      await this.db.dynamicConfigItem.createMany({
        data,
      })
    } catch (error) {
      console.log(error)
    }
  }
}

;(async function () {
  const bannedKeywords = ENV.bannedKeywords
  if (!bannedKeywords) {
    throw new Error('No banned keywords')
  }

  const runner = container.resolve(Runner)
  runner.run(bannedKeywords)
})()
