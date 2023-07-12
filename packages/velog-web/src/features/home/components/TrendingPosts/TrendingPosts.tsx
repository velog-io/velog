'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import { Posts } from '@/types/post'
import { Timeframe, useTimeframe } from '@/features/home/state/timeframe'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useSearchParams } from 'next/navigation'

type Props = {
  data: Posts[]
}

function TrendingPosts({ data }: Props) {
  const searchParmas = useSearchParams()
  const timeframe = (searchParmas.get('timeframe') || 'week') as Timeframe

  const { prevTimeFrame, posts, isLoading, fetchNextPosts } =
    useTrendingPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  // When timeframe was changed
  useEffect(() => {
    if (prevTimeFrame.current === timeframe) return
    fetchNextPosts({
      limit: 24,
      offset: 0,
      timeframe,
    })
  }, [timeframe, prevTimeFrame, fetchNextPosts])

  // infinite scroll
  const getTreningPostsMore = useCallback(() => {
    fetchNextPosts({
      limit: 8,
      offset: posts.length,
      timeframe,
    })
  }, [fetchNextPosts, posts.length, timeframe])

  useInfiniteScroll(ref, getTreningPostsMore)

  return (
    <>
      <PostCardGrid
        data={posts}
        forHome={true}
        forPost={false}
        loading={isLoading}
      />
      <div ref={ref} />
    </>
  )
}

export default TrendingPosts
