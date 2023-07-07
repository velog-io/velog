import { TrendingPostsInput } from '@/graphql/generated'
import { sdk } from '@/lib/sdk'
import { Posts } from '@/types/post'

export default async function getTrendingPosts({
  limit = 5,
  offset = 0,
  timeframe = 'week',
}: Partial<TrendingPostsInput> = {}) {
  const { trendingPosts } = await sdk.trendingPosts({
    input: { limit, offset, timeframe },
  })

  if (!trendingPosts) return []

  return trendingPosts as Posts[]
}
