import { Resolvers } from '@graphql/generated'
import { AuthService } from '@services/AuthService/index.js'
import { container } from 'tsyringe'

const authResolvers: Resolvers = {
  Mutation: {
    sendMail: async (_, { input }) => {
      const authService = container.resolve(AuthService)
      return await authService.sendMail(input)
    },
  },
}

export default authResolvers
