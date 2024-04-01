import { pick } from 'rambda'
import { DbService } from '@lib/db/DbService.js'
import { injectable, singleton } from 'tsyringe'
import { Prisma, Tag } from '@packages/database/src/velog-rds.mjs'
import { ElasticSearchService } from '@lib/elasticSearch/ElasticSearchService.js'
import { ApiResponse } from '@elastic/elasticsearch'
import { TagService } from '@services/TagService/index.js'
import { ENV } from '@env'

interface Service {
  get searchSync(): SearchSyncType
}

@injectable()
@singleton()
export class SearchService implements Service {
  constructor(
    private readonly db: DbService,
    private readonly elasticSearch: ElasticSearchService,
    private readonly tagService: TagService,
  ) {}
  public get searchSync(): SearchSyncType {
    return {
      update: async (postId: string) => await this.searchSyncUpdate(postId),
      remove: async (postId: string) => await this.searchSyncRemove(postId),
    }
  }
  private async searchSyncUpdate(postId: string) {
    if (ENV.appEnv === 'development') return
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

    const tagLoader = this.tagService.tagLoader()
    const tags = await tagLoader.load(post.id)

    const postWithTags = Object.assign(post, { tags })
    const serialized = this.serializePost(postWithTags)

    try {
      const result = await this.elasticSearch.client.index({
        id: postId,
        index: 'posts',
        body: serialized,
      })

      return result
    } catch (error) {
      console.log('elasticsearch post update', error)
      throw error
    }
  }
  private async searchSyncRemove(postId: string) {
    if (ENV.appEnv === 'development') return
    try {
      return this.elasticSearch.client.delete({
        id: postId,
        index: 'posts',
      })
    } catch (error) {
      console.log('elasticsearch post delete', error)
      throw error
    }
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
