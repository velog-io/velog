import { BadRequestError } from '@errors/BadRequestErrors.js'
import { ForbiddenError } from '@errors/ForbiddenError.js'
import { NotFoundError } from '@errors/NotfoundError.js'
import { UnauthorizedError } from '@errors/UnauthorizedError.js'
import {
  Notification,
  NotificationType,
  NotificationsInput,
  CommentNotificationActionInput,
  FollowNotificationActionInput,
  PostLikeNotificationActionInput,
} from '@graphql/helpers/generated'
import { DbService } from '@lib/db/DbService.js'
import { UtilsService } from '@lib/utils/UtilsService.js'
import { Prisma } from '@prisma/client'
import { UserService } from '@services/UserService/index.js'
import { injectable, singleton } from 'tsyringe'
import { z } from 'zod'

interface Service {
  list(query?: NotificationsInput, signedUserId?: string): Promise<Notification[]>
  getCount(signedUserId?: string): Promise<number>
  create(args: CreateArgs): Promise<Notification>
  read(notificationIds: string[], signedUserId?: string): Promise<void>
  readAll(signedUserId?: string): Promise<void>
  remove(args: RemoveArgs): Promise<void>
  removeAll(signedUserId?: string): Promise<void>
  createOrUpdate(args: CreateOrUpdate): Promise<void>
}

@injectable()
@singleton()
export class NotificationService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly utils: UtilsService,
    private readonly userService: UserService,
  ) {}
  public async list(
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
  public async getCount(signedUserId?: string): Promise<number> {
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
  public async create({
    type,
    fkUserId,
    actorId = '',
    actionId,
    action: actionInfo,
    signedUserId,
  }: CreateArgs): Promise<Notification> {
    if (signedUserId && signedUserId !== actorId) {
      throw new ForbiddenError('Mismatch between logged in user and actor user')
    }

    const actor = await this.userService.findById(actorId)

    if (!actor) {
      throw new NotFoundError('Not found actor')
    }

    if (!actionInfo) {
      throw new BadRequestError('Not found action')
    }

    const action = (actionInfo as any)[type]

    const validate = this.notificationActionValidate(type, action)

    if (!validate) {
      throw new BadRequestError('Wrong action payload')
    }

    const targetUser = await this.userService.findById(fkUserId)

    if (!targetUser) {
      throw new NotFoundError('Notification failed: Target user not found')
    }

    const notification = await this.db.notification.create({
      data: {
        type,
        fk_user_id: fkUserId,
        action_id: actionId,
        actor_id: actorId || null,
        action,
      },
    })

    return notification as unknown as Notification
  }
  private notificationActionValidate(type: NotificationType, action: any) {
    const schemaSelector = {
      follow: z.object({
        follower_id: z.string().uuid(),
        follower_user_id: z.string().uuid(),
        actor_display_name: z.string(),
        actor_username: z.string(),
        actor_thumbnail: z.string(),
        type: z.enum(['follow']),
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
  public async read(notificationIds: string[], signedUserId?: string): Promise<void> {
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
  public async readAll(signedUserId?: string): Promise<void> {
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
  public async removeAll(signedUserId?: string): Promise<void> {
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
  public async createOrUpdate({ fkUserId, action, actionId, actorId, type }: CreateOrUpdate) {
    const notification = await this.findByUniqueKey({
      fkUserId,
      actorId,
      actionId,
      type,
    })

    if (notification) {
      await this.db.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          is_deleted: false,
        },
      })
    }

    if (!notification) {
      try {
        await this.create({
          fkUserId,
          type,
          actionId,
          actorId,
          action,
        })
      } catch (_) {}
    }
  }
  public async remove({ actionId, actorId, fkUserId, type }: RemoveArgs) {
    const notification = await this.findByUniqueKey({
      actionId,
      actorId,
      fkUserId,
      type,
    })

    if (notification) {
      await this.db.notification.update({
        where: {
          id: notification.id,
        },
        data: {
          is_deleted: true,
        },
      })
    }
  }
  private async findByUniqueKey({
    fkUserId,
    actorId,
    type,
    actionId,
  }: FindByUniqueKey): Promise<Notification | null> {
    const notification = await this.db.notification.findFirst({
      where: {
        fk_user_id: fkUserId,
        actor_id: actorId,
        action_id: actionId,
        type,
      },
    })
    return notification as unknown as Notification | null
  }
}

type CreateArgs = {
  fkUserId: string
  type: NotificationType
  actorId?: string
  actionId?: string
  signedUserId?: string
  action: {
    comment?: CommentNotificationActionInput
    follower?: FollowNotificationActionInput
    postLike?: PostLikeNotificationActionInput
  }
}

type CreateOrUpdate = {
  fkUserId: string
  type: NotificationType
  actionId: string
  actorId: string
  action: {
    comment?: CommentNotificationActionInput
    follower?: FollowNotificationActionInput
    postLike?: PostLikeNotificationActionInput
  }
}

type RemoveArgs = {
  fkUserId: string
  type: NotificationType
  actionId: string
  actorId: string
}

type FindByUniqueKey = {
  fkUserId: string
  actorId: string
  actionId: string
  type: NotificationType
}
