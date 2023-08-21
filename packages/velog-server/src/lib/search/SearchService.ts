import { DbService } from '@lib/db/DbService.js'
import { PostsTagsService } from '@services/PostsTagsService/index.js'
import { injectable, singleton } from 'tsyringe'
import { Client } from '@elastic/elasticsearch'
import { ENV } from '@env'
import { PostService } from '@services/PostService/index.js'

interface Service {}

@injectable()
@singleton()
export class SearchService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly postsTagsService: PostsTagsService,
    private readonly postService: PostService
  ) {}
  public get esClient() {
    return new Client({ node: ENV.esHost })
  }
  public get searchSync() {
    return {
      update: async (postId: string) => await this.searchSyncUpdate(postId),
      remove: async (postId: string) => await this.searchSyncRemove(postId),
    }
  }
  private async searchSyncUpdate(postId: string) {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!post) return

    const tagsLoader = this.postsTagsService.createTagsLoader()
    const tags = await tagsLoader.load(post.id)

    const postWithTags = Object.assign(post, { tags })
    const serialized = this.postService.serializePost(postWithTags)

    return this.esClient.index({
      id: postId,
      index: 'posts',
      body: serialized,
    })
  }
  private async searchSyncRemove(postId: string) {
    return this.esClient.delete({
      id: postId,
      index: 'posts',
    })
  }
}
