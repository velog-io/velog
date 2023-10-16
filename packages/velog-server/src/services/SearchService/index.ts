import { pick } from 'rambda'
import { DbService } from '@lib/db/DbService.js'
import { PostTagService } from '@services/PostTagService/index.js'
import { injectable, singleton } from 'tsyringe'
import { ENV } from '@env'
import { Prisma, Tag } from '@prisma/client'
import { ElasticSearchService } from '@lib/elasticSearch/ElasticSearchService.js'
import { ApiResponse } from '@elastic/elasticsearch'

interface Service {
  get searchSync(): SearchSyncType
}

@injectable()
@singleton()
export class SearchService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly elasticSearch: ElasticSearchService,
    private readonly postTagService: PostTagService,
  ) {}
  public get searchSync(): SearchSyncType {
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

    const tagsLoader = this.postTagService.createTagsLoader()
    const tags = await tagsLoader.load(post.id)

    const postWithTags = Object.assign(post, { tags })
    const serialized = this.serializePost(postWithTags)

    if (ENV.appEnv === 'development') return
    return this.elasticSearch.client.index({
      id: postId,
      index: 'posts',
      body: serialized,
    })
  }
  private async searchSyncRemove(postId: string) {
    if (ENV.appEnv === 'development') return
    return this.elasticSearch.client.delete({
      id: postId,
      index: 'posts',
    })
  }
  private serializePost(post: SerializedPostParam) {
    const picked = pick(
      [
        'id',
        'title',
        'body',
        'thumbnail',
        'user',
        'is_private',
        'released_at',
        'likes',
        'views',
        'meta',
        'user',
        'tags',
        'url_slug',
      ],
      post,
    )
    return {
      ...picked,
      // _id: picked.id,
      // objectID: picked.id,
      body: picked.body?.slice(0, 8000),
      user: {
        id: picked.user.id,
        username: picked.user.username,
        profile: {
          id: picked.user.profile!.id,
          display_name: picked.user.profile!.display_name!,
          thumbnail: picked.user.profile!.thumbnail!,
        },
      },
      tags: picked.tags.map((tag) => tag.name || '').filter(Boolean),
    }
  }
}

type SearchSyncType = {
  update: (postId: string) => Promise<ApiResponse<any, any> | undefined>
  remove: (postId: string) => Promise<ApiResponse<any, any> | undefined>
}

export type SerializedPostParam = Prisma.PostGetPayload<{
  include: {
    id: true
    title: true
    body: true
    thumbnail: true
    is_private: true
    released_at: true
    likes: true
    views: true
    meta: true
    url_slug: true
    user: {
      select: {
        id: true
        username: true
        profile: {
          select: {
            id: true
            display_name: true
            thumbnail: true
          }
        }
      }
    }
  }
}> & { tags: Tag[] }
