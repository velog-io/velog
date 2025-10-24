import { Resolvers } from '@graphql/helpers/generated.js'
import { TagService } from '@services/TagService/index.js'
import { container } from 'tsyringe'

const tagResolvers: Resolvers = {
  Query: {
    userTags: async (_, { input }, ctx) => {
      const tagService = container.resolve(TagService)
      return await tagService.getUserTags(input.username, ctx.user?.id)
    },
    tag: async (_, { name }) => {
      const tagService = container.resolve(TagService)
      return await tagService.findByName(name)
    },
  },
  Tag: {
    posts_count: async (parent) => {
      if (parent.posts_count) return parent.posts_count

      const tagService = container.resolve(TagService)
      return await tagService.getPostsCount(parent.id)
    },
  },
}

export default tagResolvers
