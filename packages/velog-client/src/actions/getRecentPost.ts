import { RecentPostsInput } from '@/graphql/generated'
import { sdk } from '@/lib/sdk'
import { PartialPost } from '@/types/post'

export default async function getRecentPost({
  cursor,
  limit,
}: RecentPostsInput) {
  const { recentPosts } = await sdk.recentPosts({
    input: { limit, cursor },
  })
  return (recentPosts as PartialPost[]) || []
}
