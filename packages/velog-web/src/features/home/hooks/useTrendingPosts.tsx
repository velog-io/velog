import { Timeframe } from '@/features/home/state/timeframe'

import { sdk } from '@/lib/sdk'
import { Posts } from '@/types/post'
import { useCallback, useState } from 'react'

type TrendingPostsInput = {
  limit: number
  offset: number
  timeframe: Timeframe
}

if (!process.env.NEXT_PUBLIC_DEFAULT_TIMEFRAME) {
  throw new Error('please set default timeframe')
}

export default function useTrendingPosts(intialPosts: Posts[]) {
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState<Posts[]>(intialPosts)
  const [beforeTimeframe, setBeforeTimeframe] = useState<string>(
    process.env.NEXT_PUBLIC_DEFAULT_TIMEFRAME!
  )

  const fetching = useCallback(
    async ({ limit, offset, timeframe }: TrendingPostsInput) => {
      setLoading(true)

      if (beforeTimeframe !== timeframe) {
        setBeforeTimeframe(timeframe)
        setPosts([])
      }

      const { trendingPosts } = await sdk.trendingPosts({
        input: { limit, offset, timeframe },
      })

      if (Array.isArray(trendingPosts) && trendingPosts.length > 0) {
        setPosts((prev) => [...prev, ...(trendingPosts as Posts[])])
      }

      setLoading(false)
    },
    [beforeTimeframe]
  )

  return { loading, posts, fetching, beforeTimeframe }
}
