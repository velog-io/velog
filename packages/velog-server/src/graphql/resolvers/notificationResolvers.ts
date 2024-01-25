import { Resolvers } from '@graphql/helpers/generated'
import { NotificationService } from '@services/NotificationService/index.js'
import { container } from 'tsyringe'

const notificationResolvers: Resolvers = {
  Query: {
    notifications: async (_, { input }, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.getNotifications(input, ctx.user?.id)
    },
    notificationCount: async (_, __, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.getNotificationCount(ctx.user?.id)
    },
  },
  Mutation: {
    createNotification: async (_, { input }, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.createNotification({ ...input, signedUserId: ctx.user?.id })
    },
    readNotification: async (_, { input }, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.readNotification(input.notification_ids, ctx.user?.id)
    },
    readAllNotifications: async (_, __, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.readAllNotification(ctx.user?.id)
    },
    removeAllNotifications: async (_, __, ctx) => {
      const notificationService = container.resolve(NotificationService)
      return await notificationService.removeAllNotifications(ctx.user?.id)
    },
  },
}

export default notificationResolvers
