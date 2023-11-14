import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { User, UserMeta } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findByUserId(user: User, signedUserId?: string): Promise<UserMeta | null>
}

@injectable()
@singleton()
export class UserMetaService implements Service {
  constructor(private readonly db: DbService) {}
  async findByUserId(user: User, signedUserId?: string): Promise<UserMeta | null> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    if (user.id !== signedUserId) {
      throw new UnauthorizedError('No permission to read user_meta')
    }
    return await this.db.userMeta.findFirst({
      where: {
        fk_user_id: user.id,
      },
    })
  }
}
