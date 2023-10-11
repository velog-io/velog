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

    const FIVE_MINUTE = 60 * 5
    const { trendingPosts } = await graphqlFetch<{ trendingPosts: Post[] }>({
      method: 'GET',
      body,
      next: { revalidate: FIVE_MINUTE },
    })

    if (!trendingPosts) return []

    return trendingPosts
  } catch (error) {
    console.log('getTrendingPosts error', error)
    return []
  }
}
