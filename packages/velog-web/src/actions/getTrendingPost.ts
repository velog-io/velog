import { TrendingPostsDocument, TrendingPostsInput } from '@/graphql/generated'
import postData from '@/lib/postData'
import { Posts } from '@/types/post'

export default async function getTrendingPosts({
  limit = Number(process.env.NEXT_PUBLIC_DEFAULT_POST_LIMIT) || 24,
  offset = 0,
  timeframe = process.env.NEXT_PUBLIC_DEFAULT_POST_TIMEFRAME,
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
