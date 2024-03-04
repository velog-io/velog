import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { GetSeriesInput } from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService.js'
import { SeriesPost, Series } from '@prisma/velog-rds/client'
import DataLoader from 'dataloader'

import { injectable, singleton } from 'tsyringe'

interface Service {
  findBySeriesId(seriesId: string): Promise<Series | null>
  findByUserId(userId?: string): Promise<Series[]>
  getSeriesByPostId(postId: string): Promise<Series | null>
  getPostCount(series: string): Promise<number>
  seriesPostLoader(): DataLoader<string, SeriesPost[]>
  getThumbnail(seriesId: string): Promise<string | null>
  getSeriesListByUsername(username: string): Promise<Series[]>
  getSeries(input: GetSeriesInput): Promise<Series | null>
  appendToSeries(seriesId: string, postId: string): Promise<void>
}

@injectable()
@singleton()
export class SeriesService implements Service {
  constructor(private readonly db: DbService) {}
  public async findBySeriesId(seriesId: string): Promise<Series | null> {
    const series = await this.db.series.findUnique({
      where: {
        id: seriesId,
      },
    })
    return series
  }

  public async findByUserId(userId?: string): Promise<Series[]> {
    if (!userId) {
      throw new UnauthorizedError('Not logged in')
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

  public async getThumbnail(seriesId: string): Promise<string | null> {
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
  public async getSeriesListByUsername(username: string): Promise<Series[]> {
    const seriesList = await this.db.series.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        user: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
    return seriesList
  }

  public async getSeries(input: GetSeriesInput): Promise<Series | null> {
    const { id, username, url_slug } = input
    if (id) {
      return await this.findBySeriesId(id)
    }

    const series = await this.db.series.findFirst({
      where: {
        user: {
          username,
        },
        url_slug,
      },
    })

    return series
  }

  public async appendToSeries(seriesId: string, postId: string): Promise<void> {
    const postsCount = await this.db.seriesPost.count({
      where: {
        fk_series_id: seriesId,
      },
    })

    const nextIndex = postsCount + 1
    const series = await this.db.series.findUnique({
      where: {
        id: seriesId,
      },
    })

    if (!series) return

    await this.db.seriesPost.create({
      data: {
        fk_post_id: postId,
        fk_series_id: seriesId,
        index: nextIndex,
      },
    })
  }

  public async subtractIndexAfter(seriesId: string, afterIndex: number) {
    return this.db.seriesPost.updateMany({
      where: {
        fk_series_id: seriesId,
        index: {
          gt: afterIndex,
        },
      },
      data: {
        index: {
          decrement: 1,
        },
      },
    })
  }
}
