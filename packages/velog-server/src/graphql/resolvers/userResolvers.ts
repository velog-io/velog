import { Resolvers } from '@graphql/generated'
import { UserService } from '@services/UserService/index.js'
import { container } from 'tsyringe'

const userResolvers: Resolvers = {
  Query: {
    currentUser: async (_, __, ctx) => {
      const userService = container.resolve(UserService)
      return await userService.getCurrentUser(ctx.user?.id)
    },
  },
}

export default userResolvers
