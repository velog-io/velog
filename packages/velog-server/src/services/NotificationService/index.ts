import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import {
  Notification,
  NotificationType,
  PostLikeNotificationAction,
  FollowerNotificationAction,
  CommentNotificationAction,
} from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { UserService } from '@services/UserService/index.js'
import { injectable, singleton } from 'tsyringe'
import { z } from 'zod'

interface Service {
  getNotifications(signedUserId?: string): Promise<Notification[]>
  getNotificationCount(signedUserId?: string): Promise<NotificationCountResult>
  createNotification<T extends NotificationType>(
    args: CreateNotificationArgs<T>,
  ): Promise<Notification>
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
  public async getNotificationCount(signedUserId?: string): Promise<NotificationCountResult> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('Not found user')
    }
    const count = await this.db.notification.count({
      where: {
        fk_user_id: signedUserId,
        is_deleted: false,
        is_read: false,
      },
    })

    return { count }
  }
  public async createNotification<T extends NotificationType>({
    type,
    fk_user_id,
    action_id,
    action,
  }: CreateNotificationArgs<T>): Promise<Notification> {
    if (!action) {
      throw new BadRequestError('Not found action')
    }

    const validate = this.notificationActionValidate(type, action)
    if (!validate) {
      throw new BadRequestError('Wrong action payload')
    }

    const user = await this.userService.findById(fk_user_id)

    if (!user) {
      throw new NotFoundError('Notification failed: Target user not found')
    }

    const notification = await this.db.notification.create({
      data: {
        type,
        fk_user_id,
        action_id,
        action,
      },
    })

    return notification as unknown as Notification
  }
  private notificationActionValidate(type: NotificationType, action: any) {
    const schemaSelector = {
      follower: z.object({
        id: z.string().uuid(),
        fk_user_id: z.string().uuid(),
        display_name: z.string(),
      }),
      comment: z.object({
        id: z.string(),
        fk_user_id: z.string().uuid(),
        title: z.string().uuid(),
        url_slug: z.string(),
        writer_username: z.string(),
        text: z.string(),
      }),
      postLike: z.object({
        id: z.string().uuid(),
        fk_user_id: z.string().uuid(),
        display_name: z.string(),
        title: z.string(),
        url_slug: z.string(),
        writer_username: z.string(),
      }),
    }

    try {
      const schema = schemaSelector[type]

      if (!schema) {
        throw new BadRequestError('Invalid create action type')
      }

      return this.utils.validateBody(schema, action)
    } catch (error) {
      return false
    }
  }
  private isCommentAction(args: any): args is CommentNotificationAction {
    if (args.type === 'comment') return true
    return false
  }
  private isPostLikeAction(args: any): args is PostLikeNotificationAction {
    if (args.type === 'postLike') return true
    return false
  }
  private isFollowerAction(args: any): args is FollowerNotificationAction {
    if (args.type === 'follower') return true
    return false
  }
  public async markNotificationsAsRead(
    notificationIds: string[],
    signedUserId?: string,
  ): Promise<void> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('Not found user')
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

export type CreateNotificationArgs<T = NotificationType> = {
  type: NotificationType
  fk_user_id: string
  action_id: string
  action: T extends 'comment'
    ? CommentNotificationAction
    : NotificationType extends 'follower'
    ? FollowerNotificationAction
    : NotificationType extends 'postLike'
    ? PostLikeNotificationAction
    : unknown
}

type NotificationCountResult = {
  count: number
}
