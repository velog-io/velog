import { TrendingPostsInput } from '@/graphql/generated'
import { sdk } from '@/lib/sdk'
import { Posts } from '@/types/post'
import { useCallback, useState } from 'react'

export default function useTrendingPosts() {
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<Posts[]>([])

  const fetching = useCallback(
    async ({ limit, offset, timeframe }: TrendingPostsInput) => {
      setLoading(true)

      const { trendingPosts } = await sdk.trendingPosts({
        input: { limit, offset, timeframe },
      })

      if (Array.isArray(trendingPosts) && trendingPosts.length > 0) {
        setPosts((prev) => [...prev, ...(trendingPosts as Posts[])])
      }
      setLoading(false)
    },
    []
  )

  return { loading, posts, fetching }
}
