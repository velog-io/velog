import { DbService } from '../db/DbService.mjs'
import { injectable, singleton } from 'tsyringe'

interface Service {
  addBlockList: (username: string) => Promise<void>
  readBlockList: () => Promise<string[]>
}

@injectable()
@singleton()
export class BlockListService implements Service {
  constructor(private readonly db: DbService) {}
  public async addBlockList(username: string) {
    await this.db.dynamicConfigItem.create({
      data: {
        value: username,
        type: 'blockUsername',
      },
    })
  }
  public async readBlockList() {
    const blockList = await this.db.dynamicConfigItem.findMany({
      where: {
        type: 'blockUsername',
      },
    })
    return blockList.map((item) => item.value)
  }
}
