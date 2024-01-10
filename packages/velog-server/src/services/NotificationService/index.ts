import { NotFoundError } from '@errors/NotfoundError'
import { UnauthorizedError } from '@errors/UnauthorizedError'
import { Notification } from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService'
import { UtilsService } from '@lib/utils/UtilsService'
import { UserService } from '@services/UserService'
import { injectable, singleton } from 'tsyringe'

interface Service {
  getNotifications(signedUserId?: string): Promise<Notification[]>
  getNotificationCount(signedUserId?: string): Promise<number>
  markNotificationsAsRead(notificationIds: string[], signedUserId?: string): Promise<void>
}

@injectable()
@singleton()
export class NotificationService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
    private readonly userService: UserService,
  ) {}
  public async getNotifications(signedUserId?: string): Promise<Notification[]> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not Logged In')
    }
    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('Not Found User')
    }
    const notifications = await this.db.notification.findMany({
      where: {
        fk_user_id: signedUserId,
        is_deleted: false,
      },
      orderBy: {
        created_at: 'desc',
      },
    })
    return notifications as unknown as Notification[]
  }
  public async getNotificationCount(signedUserId?: string): Promise<number> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('Not Found User')
    }

    return await this.db.notification.count({
      where: {
        fk_user_id: signedUserId,
        is_deleted: false,
        is_read: false,
      },
    })
  }

  public async markNotificationsAsRead(
    notificationIds: string[],
    signedUserId?: string,
  ): Promise<void> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('Not Found User')
    }

    await this.db.notification.updateMany({
      where: {
        fk_user_id: signedUserId,
        id: {
          in: notificationIds,
        },
        is_read: false,
      },
      data: {
        is_read: true,
        read_at: this.utils.now,
      },
    })
  }
}
