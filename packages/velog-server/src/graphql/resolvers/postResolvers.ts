import { Resolvers } from '@graphql/generated'
import { BadRequestError } from '@errors/badRequestErrors'
import { UserService } from '@services/UserService'
import { container } from 'tsyringe'

const postResolvers: Resolvers = {
  Post: {},
  Query: {
    // async posts(parent: any, { cursor, limit = 20, username, temp_only, tag }) {
    //   if (limit && limit > 100) {
    //     throw new BadRequestError('Max limit is 100')
    //   }
    //   const userService = container.resolve(UserService)
    //   const user = username ? await userService.findByUsername(username) : null
    // },
  },
}

export default postResolvers
