import { UnauthorizedError } from '@errors/UnauthorizedError.js'

import { DbService } from '@lib/db/DbService.js'
import { Series, SeriesPost } from '@prisma/client'
import DataLoader from 'dataloader'

import { injectable, singleton } from 'tsyringe'

interface Service {
  findByUserId(userId?: string): Promise<Series[]>
  getSeriesByPostId(postId: string): Promise<Series | null>
  getPostCount(series: string): Promise<number>
  seriesPostLoader(): DataLoader<string, SeriesPost[]>
  getThumbnail(seriesId: string): Promise<string | null>
}

@injectable()
@singleton()
export class SeriesService implements Service {
  constructor(private readonly db: DbService) {}
  public async findByUserId(userId?: string): Promise<Series[]> {
    if (!userId) {
      throw new UnauthorizedError('Not Logged In')
    }
    const seriesList = await this.db.series.findMany({
      where: {
        fk_user_id: userId,
      },
      include: {
        user: true,
        seriesPost: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    })
    return seriesList
  }

  public async getSeriesByPostId(postId: string): Promise<Series | null> {
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
  public async getPostCount(seriesId: string): Promise<number> {
    const count = await this.db.seriesPost.count({
      where: {
        fk_series_id: seriesId,
      },
    })
    return count
  }
  public seriesPostLoader() {
    return this.createSeriesPostsLoader()
  }
  private createSeriesPostsLoader(): DataLoader<string, SeriesPost[]> {
    return new DataLoader(async (seriesIds) => {
      const seriesPosts = await this.db.seriesPost.findMany({
        where: {
          fk_series_id: {
            in: seriesIds as string[],
          },
        },
        include: {
          post: true,
        },
        orderBy: {
          fk_series_id: 'asc',
          index: 'asc',
        },
      })

      const postsMap: {
        [key: string]: SeriesPost[]
      } = {}

      seriesIds.forEach((seriesId) => (postsMap[seriesId] = []))
      seriesPosts.forEach((sp) => {
        postsMap[sp.fk_series_id!].push(sp)
      })
      const ordered = seriesIds.map((seriesId) => postsMap[seriesId])
      return ordered
    })
  }
  async getThumbnail(seriesId: string): Promise<string | null> {
    const seriesPost = await this.db.seriesPost.findFirst({
      where: {
        index: 1,
        fk_series_id: seriesId,
      },
      include: {
        post: true,
      },
    })

    if (!seriesPost) return null
    return seriesPost.post!.thumbnail
  }
}
