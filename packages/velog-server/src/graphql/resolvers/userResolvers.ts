import { Resolvers } from '@graphql/generated'
import { UserService } from '@services/UserService/index.js'
import { container } from 'tsyringe'

const userResolvers: Resolvers = {
  Query: {
    currentUser: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      console.log('ctx.user?.id', ctx.user?.id)
      return await userService.getCurrentUser(ctx.user?.id)
    },
  },
  Mutation: {
    logout: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      await userService.logout(ctx.reply)
      return true
    },
  },
}

export default userResolvers
