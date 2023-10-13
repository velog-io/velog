import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { VelogConfig } from '@prisma/client'
import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'

interface Service {
  velogConfigLoader(userId?: string): DataLoader<string, VelogConfig>
}

@injectable()
@singleton()
export class VelogConfigService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public velogConfigLoader(userId?: string) {
    if (!userId) {
      throw new UnauthorizedError('Not Logged In')
    }
    return this.createVelogConfigLoader()
  }
  private createVelogConfigLoader(): DataLoader<string, any> {
    return new DataLoader(async (userIds) => {
      const configs = await this.db.velogConfig.findMany({
        where: {
          fk_user_id: {
            in: userIds as string[],
          },
        },
      })

      const normalized = this.utils.normalize(configs, (config) => config.fk_user_id!)
      return userIds.map((id) => normalized[id])
    })
  }
}
