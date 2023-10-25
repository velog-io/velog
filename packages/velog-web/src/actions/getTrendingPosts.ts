import { ENV } from '@/env'
import { Post, TrendingPostsDocument, TrendingPostsInput } from '@/graphql/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getTrendingPosts({
  limit = ENV.defaultPostLimit,
  timeframe = 'week',
  offset = 0,
}: TrendingPostsInput) {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'trendingPosts',
      query: TrendingPostsDocument,
      variables: {
        input: {
          limit,
          offset,
          timeframe,
        },
      },
    }

    const { trendingPosts } = await graphqlFetch<{ trendingPosts: Post[] }>({
      method: 'GET',
      body,
      cache: 'no-cache',
    })

    return trendingPosts
  } catch (error) {
    throw error
  }
}
