'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { useCallback, useEffect, useRef } from 'react'
import type { Posts } from '@/types/post'
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

  const { posts, isLoading, fetchNextPosts } =
    useTrendingPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  // infinite scroll
  const getTreningPostsMore = useCallback(() => {
    if (isLoading) return
    fetchNextPosts({
      limit: 2,
      offset: posts.length,
      timeframe,
    })
  }, [fetchNextPosts, posts.length, timeframe, isLoading])

  // useInfiniteScroll(ref, getTreningPostsMore)

  return (
    <>
      <PostCardGrid
        posts={posts}
        forHome={true}
        forPost={false}
        loading={isLoading}
      />
      <div ref={ref} />
    </>
  )
}

export default TrendingPosts
