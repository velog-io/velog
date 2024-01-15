import { Resolvers } from '@graphql/helpers/generated'
import { AuthService } from '@services/AuthService/index.js'
import { container } from 'tsyringe'

const authResolvers: Resolvers = {
  Query: {
    isLogged: (_, __, ctx) => {
      console.log('ctx,', ctx.user)
      return !!ctx.user?.id
    },
  },
  Mutation: {
    sendMail: async (_, { input }) => {
      const authService = container.resolve(AuthService)
      return await authService.sendMail(input.email)
    },
  },
}

export default authResolvers
