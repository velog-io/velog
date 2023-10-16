import { Resolvers } from '@graphql/generated'
import { SeriesService } from '@services/SeriesService'
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
    posts_count: async (parent) => {
      const seriesService = container.resolve(SeriesService)
      return await seriesService.getPostCount(parent.id)
    },
  },
}

export default seriesResolvers
