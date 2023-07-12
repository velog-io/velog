import { Resolvers } from '@graphql/generated'
import { UserService } from '@services/UserService/index.js'
import { container } from 'tsyringe'

const userResolvers: Resolvers = {
  Query: {
    currentUser: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      return await userService.getCurrentUser(ctx.user?.id)
    },
    restoreToken: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      return await userService.restoreToken(ctx)
    },
  },
  Mutation: {
    logout: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      await userService.logout(ctx.reply)
      ctx.reply.status(204)
      return true
    },
  },
}

export default userResolvers
