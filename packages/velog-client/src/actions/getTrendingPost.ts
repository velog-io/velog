import { TrendingPostsInput } from '@/graphql/generated'
import { sdk } from '@/lib/sdk'
import { PartialPost } from '@/types/post'

export default async function getTrendingPosts({
  limit,
  offset,
  timeframe,
}: TrendingPostsInput) {
  const { trendingPosts } = await sdk.trendingPosts({
    input: { limit, offset, timeframe },
  })
  return (trendingPosts as PartialPost[]) || []
}
