import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'

interface Service {
  isBlockedUser(username: string): Promise<boolean>
}

@injectable()
@singleton()
export class DynamicConfigService implements Service {
  constructor(private readonly db: DbService) {}
  public async isBlockedUser(username: string = ''): Promise<boolean> {
    const list = await this.readBlockUserList()
    return list.includes(username)
  }
  public async isBlockedUserById(userId: string): Promise<boolean> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) {
      return false
    }
    return this.isBlockedUser(user.username)
  }
  private async readBlockUserList(): Promise<string[]> {
    const list = await this.db.dynamicConfigItem.findMany({
      where: {
        type: 'blockUsername',
      },
    })
    return list.map((item) => item.value)
  }
}
