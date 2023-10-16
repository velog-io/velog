import { Client } from '@elastic/elasticsearch'
import { ENV } from '@env'
import { injectable, singleton } from 'tsyringe'
import { BuildQueryService } from './BuildQueryService.js'
import { PostIncludeTags } from '@services/PostService/PostServiceInterface.js'

interface Service {
  get client(): Client
}

@injectable()
@singleton()
export class ElasticSearchService implements Service {
  constructor(private readonly buildQueryService: BuildQueryService) {}
  public get client(): Client {
    return new Client({ node: ENV.esHost })
  }
  public get buildQuery() {
    return {
      recommendedPostsQuery: (post: PostIncludeTags, minimumView: number = 1000) =>
        this.buildQueryService.buildRecommendedPostsQuery(post, minimumView),
      fallbackRecommendedPosts: () => this.buildQueryService.buildFallbackRecommendedPosts(),
    }
  }
}
