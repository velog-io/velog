import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { VelogConfig } from '@prisma/client'
import DataLoader from 'dataloader'
import { injectable, singleton } from 'tsyringe'

interface Service {
  velogConfigLoader(): DataLoader<string, VelogConfig>
  findByUsername(username: string): Promise<VelogConfig | null>
  updateVelogConfig(title: string, signedUserId?: string): Promise<VelogConfig>
}

@injectable()
@singleton()
export class VelogConfigService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public velogConfigLoader() {
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
  public async findByUsername(username: string): Promise<VelogConfig | null> {
    const config = await this.db.velogConfig.findFirst({
      where: {
        user: {
          username,
        },
      },
    })
    return config
  }
  public async updateVelogConfig(title: string, signedUserId?: string) {
    if (!signedUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    if (title === '' || this.utils.checkEmpty(title)) {
      throw new BadRequestError('Title must not be empty')
    }

    if (title.length > 24) {
      throw new BadRequestError('Title is too long')
    }

    const velogConfig = await this.db.velogConfig.findUnique({
      where: {
        fk_user_id: signedUserId,
      },
    })

    if (!velogConfig) {
      throw new NotFoundError('Failed to retrieve velog config')
    }

    return await this.db.velogConfig.update({
      where: {
        id: velogConfig.id,
      },
      data: {
        title,
      },
    })
  }
}
