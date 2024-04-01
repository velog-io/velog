import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'
import { PostReadLog } from '@packages/database/src/velog-rds/index.mjs'
import { LogParams } from './PostReadLogInterface'

interface Service {
  log(params: LogParams): Promise<PostReadLog>
}

@injectable()
@singleton()
export class PostReadLogService implements Service {
  constructor(private readonly db: DbService) {}
  public async log(params: LogParams): Promise<PostReadLog> {
    const exists = await this.db.postReadLog.findFirst({
      where: {
        fk_user_id: params.userId,
        fk_post_id: params.postId,
      },
    })
    if (exists) {
      return await this.db.postReadLog.update({
        where: {
          id: exists.id,
        },
        data: {
          percentage: params.percentage,
        },
      })
    }
    const readLog = await this.db.postReadLog.create({
      data: {
        fk_post_id: params.postId,
        fk_user_id: params.userId,
        percentage: params.percentage,
      },
    })
    return readLog
  }
}
