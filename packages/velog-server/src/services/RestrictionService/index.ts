import { RedisService } from '@lib/redis/RedisService.js'
import { injectable, singleton } from 'tsyringe'

interface Service {
  readBlockUserList(): Promise<string[]>
}

@injectable()
@singleton()
export class RestrictionService implements Service {
  constructor(private readonly redis: RedisService) {}
  public async readBlockUserList(): Promise<string[]> {
    const keyname = this.redis.setName.blockList
    const list = await this.redis.smembers(keyname)
    return list
  }
  public async checkBlockedUser(username: string = '') {
    const list = await this.readBlockUserList()
    const isBlocked = list.includes(username)
    return isBlocked
  }
}
