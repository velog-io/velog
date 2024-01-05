import { injectable, singleton } from 'tsyringe'
import Redis from 'ioredis'
import { ENV } from '../../env/env.mjs'

interface Service {
  get setName(): SetName
}

@injectable()
@singleton()
export class RedisService extends Redis implements Service {
  constructor() {
    super({ port: 6379, host: ENV.redisHost })
  }

  async connection(): Promise<string> {
    return new Promise((resolve) => {
      this.connect(() => {
        resolve(`Redis connection established to ${ENV.redisHost}`)
      })
    })
  }

  get setName() {
    return {
      blackList: 'set:blackList',
    }
  }

  public async addBlackList(username: string) {
    try {
      const keyname = this.setName.blackList
      await this.sadd(keyname, username)
    } catch (error) {
      throw error
    }
  }

  public async readBlackList() {
    try {
      const keyname = this.setName.blackList
      return await this.smembers(keyname)
    } catch (error) {
      throw error
    }
  }
}

type SetName = {
  blackList: string
}
