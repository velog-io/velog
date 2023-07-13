'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { Suspense, useCallback, useEffect, useRef } from 'react'
import type { Posts } from '@/types/post'
import { Timeframe, useTimeframe } from '@/features/home/state/timeframe'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useSearchParams } from 'next/navigation'

type Props = {
  data: Posts[]
}

function TrendingPosts({ data }: Props) {
  const { posts, isLoading, fetchNextPage, isFetching } = useTrendingPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  // infinite scroll
  const getTreningPostsMore = useCallback(() => {
    if (isLoading) return
    fetchNextPage()
  }, [isLoading, fetchNextPage])

  useInfiniteScroll(ref, getTreningPostsMore)
  return (
    <>
      <PostCardGrid
        posts={posts}
        forHome={true}
        forPost={false}
        loading={isLoading || isFetching}
      />
      <div ref={ref} />
    </>
  )
}

export default TrendingPosts
