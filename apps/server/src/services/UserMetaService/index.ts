import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import { DbService } from '@lib/db/DbService.js'
import { Prisma, User, UserMeta } from '@packages/database/src/velog-rds.mjs'
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
      throw new UnauthorizedError('Not logged in')
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
  public async updateUserMeta(patch: UpdateUserMetaArgs, signedUserId?: string): Promise<UserMeta> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const userMeta = await this.findByUserId(signedUserId)

    if (!userMeta) {
      return await this.db.userMeta.create({
        data: {
          fk_user_id: signedUserId,
          email_notification: patch.email_notification,
          email_promotion: patch.email_promotion,
        },
      })
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

type UpdateUserMetaArgs = {
  email_notification: boolean
  email_promotion: boolean
}
