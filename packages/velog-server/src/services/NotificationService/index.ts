import { BadRequestError } from '@errors/BadRequestErrors.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import {
  Notification,
  NotificationType,
  PostLikeNotificationAction,
  FollowerNotificationAction,
  CommentNotificationAction,
  NotificationsInput,
} from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Prisma } from '@prisma/client'
import { UserService } from '@services/UserService/index.js'
import { injectable, singleton } from 'tsyringe'
import { z } from 'zod'

interface Service {
  getNotifications(query?: NotificationsInput, signedUserId?: string): Promise<Notification[]>
  getNotificationCount(signedUserId?: string): Promise<number>
  createNotification<T extends NotificationType>(
    args: CreateNotificationArgs<T>,
  ): Promise<Notification>
  readNotification(notificationIds: string[], signedUserId?: string): Promise<void>
  readAllNotification(signedUserId?: string): Promise<void>
  removeAllNotifications(signedUserId?: string): Promise<void>
}

@injectable()
@singleton()
export class NotificationService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
    private readonly userService: UserService,
  ) {}
  public async getNotifications(
    query: NotificationsInput = {},
    signedUserId?: string,
  ): Promise<Notification[]> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not Logged In')
    }

    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('Not Found User')
    }

    const whereQuery: Prisma.NotificationWhereInput = {
      fk_user_id: signedUserId,
      is_deleted: false,
    }

    if (Object.hasOwn(query, 'is_read')) {
      Object.assign(whereQuery, { is_read: query.is_read })
    }

    const notifications = await this.db.notification.findMany({
      where: whereQuery,
      orderBy: {
        created_at: 'desc',
      },
    })
    return notifications as unknown as Notification[]
  }
  public async getNotificationCount(signedUserId?: string): Promise<number> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    return await this.db.notification.count({
      where: {
        fk_user_id: signedUserId,
        is_deleted: false,
        is_read: false,
      },
    })
  }
  public async createNotification<T extends NotificationType>({
    type,
    fk_user_id,
    actor_id,
    action_id,
    action: actionInfo,
    signedUserId,
  }: CreateNotificationArgs<T>): Promise<Notification> {
    if (!signedUserId) {
      throw new UnauthorizedError('Not logged in')
    }

    const user = await this.userService.findById(signedUserId)

    if (!user) {
      throw new NotFoundError('Not found user')
    }

    if (!actionInfo) {
      throw new BadRequestError('Not found action')
    }

    const action = (actionInfo as any)[type]

    console.log('action', action)
    const validate = this.notificationActionValidate(type, action)
    console.log('validate', validate)
    if (!validate) {
      throw new BadRequestError('Wrong action payload')
    }

    const targetUser = await this.userService.findById(fk_user_id)

    if (!targetUser) {
      throw new NotFoundError('Notification failed: Target user not found')
    }

    const notification = await this.db.notification.create({
      data: {
        type,
        fk_user_id,
        action_id,
        actor_id: actor_id || null,
        action,
      },
    })

    return notification as unknown as Notification
  }
  private notificationActionValidate(type: NotificationType, action: any) {
    const schemaSelector = {
      follower: z.object({
        follower_id: z.string().uuid(),
        follower_user_id: z.string().uuid(),
        actor_display_name: z.string(),
        actor_username: z.string(),
        actor_thumbnail: z.string(),
        type: z.enum(['follower']),
      }),
      comment: z.object({
        comment_id: z.string().uuid(),
        post_id: z.string().uuid(),
        post_title: z.string(),
        post_url_slug: z.string(),
        post_writer_username: z.string(),
        comment_text: z.string(),
        actor_display_name: z.string(),
        actor_username: z.string(),
        actor_thumbnail: z.string(),
        type: z.enum(['comment']),
      }),
      postLike: z.object({
        post_like_id: z.string().uuid(),
        post_id: z.string().uuid(),
        post_title: z.string(),
        post_url_slug: z.string(),
        post_writer_username: z.string(),
        actor_display_name: z.string(),
        actor_username: z.string(),
        actor_thumbnail: z.string(),
        type: z.enum(['postLike']),
      }),
    }

    const schema = schemaSelector[type]

    if (!schema) {
      throw new BadRequestError('Invalid create action type')
    }

    return this.utils.validateBody(schema, action)
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
  public async readNotification(notificationIds: string[], signedUserId?: string): Promise<void> {
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
  async readAllNotification(signedUserId?: string): Promise<void> {
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
      },
      data: {
        is_read: true,
        read_at: this.utils.now,
      },
    })
  }
  async removeAllNotifications(signedUserId?: string): Promise<void> {
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
      },
      data: {
        is_deleted: true,
      },
    })
  }
}

export type CreateNotificationArgs<T = NotificationType> = {
  type: NotificationType
  fk_user_id: string
  actor_id?: string
  action_id?: string
  signedUserId?: string
  action: T extends 'comment'
    ? CommentNotificationAction
    : NotificationType extends 'follower'
    ? FollowerNotificationAction
    : NotificationType extends 'postLike'
    ? PostLikeNotificationAction
    : unknown
}
