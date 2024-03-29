import { injectable, singleton } from 'tsyringe'
import { PostIncludeTags } from '@services/PostService/PostServiceInterface'

@injectable()
@singleton()
export class BuildQueryService {
  buildRecommendedPostsQuery(post: PostIncludeTags, minimumView?: number) {
    if (!post?.tags || !post.title || !post.body) {
      throw new Error(`No tags`)
    }
    const tagsQuery = post.tags.map((tag) => ({
      match_phrase: {
        tags: tag.name as string,
      },
    }))
    const query = {
      bool: {
        must_not: {
          term: {
            _id: post.id,
          },
        },
        must: [
          {
            bool: {
              should: [
                {
                  more_like_this: {
                    fields: ['title'],
                    like: post.title,
                    min_term_freq: 1,
                    min_doc_freq: 1,
                  },
                },
                {
                  more_like_this: {
                    fields: ['body'],
                    like: post.body,
                  },
                },
                ...tagsQuery,
              ],
            },
          },
          {
            range: {
              views: {
                gte: minimumView,
              },
            },
          },
          {
            match: {
              is_private: {
                query: false,
                boost: 0,
              },
            },
          },
        ],
      },
    }
    return query
  }
  buildFallbackRecommendedPosts() {
    const query = {
      bool: {
        should: [
          {
            range: {
              likes: {
                gte: 25,
                boost: 2,
              },
            },
          },
          {
            range: {
              views: {
                gte: 1000,
                boost: 10,
              },
            },
          },
        ],
        must: [
          {
            range: {
              released_at: {
                gte: 'now-100d/d',
              },
            },
          },
        ],
      },
    }
    return query
  }
}
