'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { Suspense, useEffect, useRef } from 'react'
import { Posts } from '@/types/post'
import { useTimeframeValue } from '@/features/home/state/timeframe'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import PostCardSkeletonGrid from '@/features/post/components/PostCardGrid/PostCardSkeletonGrid'

type Props = {
  data: Posts[]
}

function TrendingPosts({ data }: Props) {
  const { timeframe } = useTimeframeValue()
  const { loading, posts, fetching, beforeTimeframe } = useTrendingPosts(data)

  useEffect(() => {
    if (beforeTimeframe === timeframe) return
    fetching({
      limit: 20,
      offset: 0,
      timeframe,
    })
  }, [fetching, timeframe, beforeTimeframe])

  return (
    <Suspense
      fallback={<PostCardSkeletonGrid forHome={true} forPost={false} />}
    >
      <PostCardGrid
        data={posts}
        forHome={true}
        forPost={false}
        loading={loading}
      />
    </Suspense>
  )
}

export default TrendingPosts
