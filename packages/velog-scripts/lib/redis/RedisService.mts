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
      blockList: 'set:blockList',
    }
  }

  public async addBlockList(username: string) {
    try {
      const keyname = this.setName.blockList
      await this.sadd(keyname, username)
    } catch (error) {
      throw error
    }
  }

  public async readBlockList() {
    try {
      const keyname = this.setName.blockList
      return await this.smembers(keyname)
    } catch (error) {
      throw error
    }
  }
}

type SetName = {
  blockList: string
}
