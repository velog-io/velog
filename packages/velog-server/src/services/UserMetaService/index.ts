import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { Prisma, User, UserMeta } from '@prisma/client'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getMyMeta(user: User, signedUserId?: string): Promise<UserMeta | null>
  updateUserMeta(patch: Prisma.UserMetaUpdateInput, signedUserId?: string): Promise<UserMeta>
}

@injectable()
@singleton()
export class UserMetaService implements Service {
  constructor(private readonly db: DbService) {}
  public async findByUserId(userId: string): Promise<UserMeta | null> {
    return await this.db.userMeta.findFirst({
      where: {
        fk_user_id: userId,
      },
    })
  }
  public async getMyMeta(user: User, signedUserId?: string): Promise<UserMeta | null> {
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
  public async updateUserMeta(patch: Prisma.UserMetaUpdateInput, signedUserId?: string) {
    if (!signedUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    const userMeta = await this.findByUserId(signedUserId)

    if (!userMeta) {
      throw new NotFoundError('Could not find user_meta')
    }

    return await this.db.userMeta.update({
      where: {
        id: userMeta.id,
      },
      data: {
        ...patch,
      },
    })
  }
}
