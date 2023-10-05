import { DbService } from '@lib/db/DbService.js'
import { Series } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {}

@injectable()
@singleton()
export class SeriesService implements Service {
  constructor(private readonly db: DbService) {}
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
