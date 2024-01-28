import { Resolvers } from '@graphql/helpers/generated'
import { AuthService } from '@services/AuthService/index.js'
import { NotificationService } from '@services/NotificationService/index.js'
import { container } from 'tsyringe'

const notificationResolvers: Resolvers = {
  Query: {
    notifications: async (_, { input }, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.list(input, ctx.user?.id)
    },
    notificationCount: async (_, __, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.getCount(ctx.user?.id)
    },
  },
  Mutation: {
    createNotification: async (_, { input }, ctx) => {
      const notificationService = container.resolve(NotificationService)
      const authService = container.resolve(AuthService)
      authService.isAuthenticated(ctx)
      return await notificationService.create({
        fkUserId: input.fk_user_id,
        type: input.type,
        actionId: input.action_id,
        action: input.action,
        signedUserId: ctx.user?.id,
      })
    },
    readNotification: async (_, { input }, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.read(input.notification_ids, ctx.user?.id)
    },
    readAllNotifications: async (_, __, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.readAll(ctx.user?.id)
    },
    removeAllNotifications: async (_, __, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.removeAll(ctx.user?.id)
    },
  },
}

export default notificationResolvers
