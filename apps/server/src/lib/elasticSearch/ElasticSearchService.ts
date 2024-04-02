import { Client } from '@elastic/elasticsearch'
import { ENV } from 'src/env.mjs'
import { injectable, singleton } from 'tsyringe'
import { BuildQueryService } from './BuildQueryService.js'
import { PostIncludeTags } from '@services/PostService/PostServiceInterface.js'
import { Post } from '@packages/database/velog-rds'
import { UserService } from '@services/UserService/index.js'

interface Service {
  get client(): Client
  keywordSearch(input: KeywordSearchArgs): Promise<{ count: number; posts: Post[] }>
}

@injectable()
@singleton()
export class ElasticSearchService implements Service {
  constructor(
    private readonly userService: UserService,
    private readonly buildQueryService: BuildQueryService,
  ) {}
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
  public async keywordSearch({
    keyword,
    from = 0,
    size = 20,
    username,
    signedUserId,
  }: KeywordSearchArgs): Promise<{ count: number; posts: Post[] }> {
    const query = {
      script_score: {
        query: {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    {
                      match_phrase: {
                        title: {
                          query: keyword,
                          boost: 35,
                        },
                      },
                    },
                    {
                      match_phrase: {
                        'title.raw': {
                          query: keyword,
                          boost: 35,
                        },
                      },
                    },
                    {
                      match_phrase: {
                        body: {
                          query: keyword,
                          boost: 1,
                        },
                      },
                    },
                    {
                      match_phrase: {
                        'body.raw': {
                          query: keyword,
                          boost: 1,
                        },
                      },
                    },
                  ],
                },
              },
            ] as any[],
          },
        },
        script: {
          source: "_score + doc['likes'].value * 3 + doc['views'].value * 0.005",
        },
      },
    }

    // handle user search
    if (username) {
      query.script_score.query.bool.must.push({
        term: {
          'user.username': {
            value: username,
            boost: 0,
          },
        },
      })
    }

    // hides private posts except signed users's private posts
    const privatePostsQuery = {
      bool: {
        should: [
          {
            match: {
              is_private: {
                query: false,
                boost: 0,
              },
            },
          },
        ] as any[],
      },
    }

    if (signedUserId) {
      privatePostsQuery.bool.should.push({
        bool: {
          must: [
            {
              match: {
                is_private: {
                  query: true,
                  boost: 0,
                },
              },
            },
            {
              match_phrase: {
                'user.id': {
                  query: signedUserId,
                  boost: 0,
                },
              },
            },
          ],
        },
      })
    }

    query.script_score.query.bool.must.push(privatePostsQuery)

    const result = await this.client.search({
      index: 'posts',
      body: {
        from,
        size,
        query,
      },
    })

    const sources = result.body.hits.hits
      .map((hit: any) => hit._source)
      .map((p: any) => ({ ...p, released_at: new Date(p.released_at) }))

    const promises = sources.map(async (post: any) => {
      try {
        const result = await this.userService.checkExistsUser(post?.user?.id)
        return { id: post.id, result }
      } catch (error) {
        console.error('Error checking user:', error)
        return { id: post.id, result: false }
      }
    })

    const promiseResult = await Promise.all(promises)
    const existsUserPosts = promiseResult.filter(({ result }) => result).map(({ id }) => id)

    const data = {
      count: result.body.hits.total.value,
      posts: sources.filter((post: any) => existsUserPosts.includes(post.id)),
    }

    return data
  }
}

type KeywordSearchArgs = {
  keyword: string
  from: number
  size: number
  username?: string
  signedUserId?: string | null
}
