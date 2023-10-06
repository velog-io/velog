import { ENV } from '@/env'
import { TrendingPostsDocument, TrendingPostsInput } from '@/graphql/generated'
import postData from '@/lib/postData'
import { Posts } from '@/types/post'

export default async function getTrendingPosts({
  limit = ENV.defaultPostLimit,
  timeframe = 'week',
  offset = 0,
}: TrendingPostsInput) {
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

    const FIVE_MINUTE = 60 * 5
    const { trendingPosts } = await postData({
      body,
      next: { revalidate: FIVE_MINUTE },
    })

    if (!trendingPosts) return []

    return trendingPosts as Posts[]
  } catch (error) {
    console.log('getTrendingPosts error', error)
    return []
  }
}
