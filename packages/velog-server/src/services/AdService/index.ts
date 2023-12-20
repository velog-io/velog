import { BadRequestError } from '@errors/BadRequestErrors.js'
import { AdsInput } from '@graphql/generated'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Ad, Prisma } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getAds(input: AdsInput): Promise<Ad[]>
}

@injectable()
@singleton()
export class AdService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
  ) {}
  public async getAds({ type, writer_username, limit = 2 }: AdsInput): Promise<Ad[]> {
    if (!['feed', 'banner'].includes(type)) {
      throw new BadRequestError('Invalid type')
    }

    const now = this.utils.now

    const whereInput: Prisma.AdWhereInput = {
      type,
      is_disabled: false,
      start_date: {
        lte: now,
      },
      end_date: {
        gt: now,
      },
    }

    if (type === 'banner' && writer_username) {
      // handle where input
      return []
    }

    const ads = await this.db.ad.findMany({
      where: whereInput,
      take: limit,
    })

    return ads
  }
}
