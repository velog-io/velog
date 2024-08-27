import { NotFoundError } from '@errors/NotfoundError.mjs'
import { DbService } from '@lib/db/DbService.mjs'
import { PostRead } from '@packages/database/velog-rds'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findMany(take: number): Promise<PostRead[]>
  findById(postReadId: string): Promise<PostRead | null>
  deleteById(postReadId: string): Promise<void>
}

@injectable()
@singleton()
export class PostReadService implements Service {
  constructor(private readonly db: DbService) {}
  public async findMany(take: number): Promise<PostRead[]> {
    const startDate = new Date('2024-01-01')
    const postReads = await this.db.postRead.findMany({
      where: {
        created_at: {
          lt: startDate,
        },
      },
      orderBy: {
        created_at: 'asc',
      },
      take,
    })
    return postReads
  }
  public async findById(postReadId: string): Promise<PostRead | null> {
    const postRead = await this.db.postRead.findUnique({
      where: {
        id: postReadId,
      },
    })
    return postRead
  }
  public async deleteById(postReadId: string): Promise<void> {
    const postRead = await this.findById(postReadId)

    if (!postRead) {
      throw new NotFoundError('Not found PostRead')
    }

    await this.db.postRead.delete({
      where: {
        id: postReadId,
      },
    })
  }
}
