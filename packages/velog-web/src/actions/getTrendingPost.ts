import { ENV } from '@/env'
import { TrendingPostsDocument, TrendingPostsInput } from '@/graphql/generated'
import postData from '@/lib/postData'
import { Posts } from '@/types/post'

export default async function getTrendingPosts({
  limit = ENV.defaultPostLimit,
  timeframe = 'month',
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

    const TEN_MINUTE = 60 * 10
    const { trendingPosts } = await postData({
      body,
      next: { revalidate: TEN_MINUTE },
    })

    if (!trendingPosts) return []

    return trendingPosts as Posts[]
  } catch (error) {
    console.log('getTrendingPosts error', error)
    return []
  }
}
