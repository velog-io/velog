import { Resolvers } from '@graphql/generated'
import { AuthService } from '@services/AuthService'
import { container } from 'tsyringe'

const authResolvers: Resolvers = {
  Mutation: {
    sendMail: async (_, { input }, ctx) => {
      const authService = container.resolve(AuthService)
      return await authService.sendMail(input)
    },
  },
}

export default authResolvers
