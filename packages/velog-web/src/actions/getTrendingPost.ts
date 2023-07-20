import { ENV } from '@/env'
import { TrendingPostsDocument, TrendingPostsInput } from '@/graphql/generated'
import postData from '@/lib/postData'
import { Posts } from '@/types/post'

export default async function getTrendingPosts({
  limit = ENV.defaultPostLimit,
  timeframe = ENV.defaultPostTimeFrame,
  offset = 0,
}: Partial<TrendingPostsInput> = {}) {
  try {
    const body = {
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

    const { trendingPosts } = await postData({
      body,
    })

    if (!trendingPosts) return []

    return trendingPosts as Posts[]
  } catch (error) {
    console.log('getTrendingPosts error', error)
    return []
  }
}
