import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'

interface Service {}

@injectable()
@singleton()
export class SeriesService implements Service {
  constructor(private readonly db: DbService) {}
  public async findByUserId(userId?: string) {
    if (!userId) {
      throw new UnauthorizedError('Not Logged In')
    }
    const seriesList = await this.db.series.findMany({
      where: {
        fk_user_id: userId,
      },
      orderBy: {
        updated_at: 'desc',
      },
    })
    return seriesList
  }

  async getPostSeries(postId: string): Promise<Series | null> {
    const seriesPost = await this.db.seriesPost.findFirst({
      where: {
        fk_post_id: postId,
      },
      include: {
        series: true,
      },
    })

    if (!seriesPost) return null
    return seriesPost?.series
  }
}
