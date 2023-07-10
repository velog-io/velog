import { TrendingPostsDocument, TrendingPostsInput } from '@/graphql/generated'
import postData from '@/lib/postData'
import { Posts } from '@/types/post'

export default async function getTrendingPosts({
  limit = 3,
  offset = 0,
  timeframe = process.env.NEXT_PUBLIC_DEFAULT_TIMEFRAME,
}: Partial<TrendingPostsInput> = {}) {
  try {
    const body = {
      operationName: 'trendingPosts',
      query: TrendingPostsDocument.loc?.source.body,
      variables: {
        input: {
          limit,
          offset,
          timeframe,
        },
      },
    }

    const {
      data: { trendingPosts },
    } = await postData({
      body,
    })

    if (!trendingPosts) return []

    return trendingPosts as Posts[]
  } catch (error) {
    console.log('getTrendingPosts error', error)
    return []
  }
}
