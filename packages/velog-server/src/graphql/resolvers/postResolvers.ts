import { BadRequestError } from '@errors/badRequestErrors'
import { Resolvers } from '@graphql/generated'
import { UserService } from '@services/userService/userService'
import { container } from 'tsyringe'

const postResolvers: Resolvers = {
  Post: {},
  Query: {
    async posts(parent: any, { cursor, limit = 20, username, temp_only, tag }) {
      if (limit && limit > 100) {
        throw new BadRequestError('Max limit is 100')
      }

      const userService = container.resolve(UserService)
      const user = username ? await userService.findByUsername(username) : null
    },
  },
}
