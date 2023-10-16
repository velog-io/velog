import { Resolvers } from '@graphql/generated'
import { SeriesService } from '@services/SeriesService'
import { UserService } from '@services/UserService'
import { container } from 'tsyringe'

const seriesResolvers: Resolvers = {
  Series: {
    series_posts: async (parent, _, ctx) => {
      if (parent.fk_user_id === ctx.user?.id) {
        const seriesService = container.resolve(SeriesService)
        const loader = seriesService.seriesPostLoader()
        return await loader.load(parent.id)
      }
    },
    user: async (parent) => {
      const userService = container.resolve(UserService)
      const loader = userService.userLoader()
      return await loader.load(parent.fk_user_id!)
    },
    thumbnail: async (parent) => {
      const seriesService = container.resolve(SeriesService)
      return await seriesService.getThumbnail(parent.id)
    },
    posts_count: async (parent) => {
      const seriesService = container.resolve(SeriesService)
      return await seriesService.getPostCount(parent.id)
    },
  },
}

export default seriesResolvers
