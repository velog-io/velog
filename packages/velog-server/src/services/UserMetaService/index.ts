import { UnauthorizedError } from '@errors/UnauthorizedError'
import { DbService } from '@lib/db/DbService'
import { User, UserMeta } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  findByUserId(user: User, loggedUserId?: string): Promise<UserMeta | null>
}

@injectable()
@singleton()
export class UserMetaService implements Service {
  constructor(private readonly db: DbService) {}
  async findByUserId(user: User, loggedUserId?: string): Promise<UserMeta | null> {
    if (!loggedUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    if (user.id !== loggedUserId) {
      throw new UnauthorizedError('No permission to read user_meta')
    }
    return await this.db.userMeta.findFirst({
      where: {
        fk_user_id: user.id,
      },
    })
  }
}
