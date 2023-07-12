'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { useCallback, useEffect, useRef } from 'react'
import { Posts } from '@/types/post'
import { Timeframe, useTimeframeValue } from '@/features/home/state/timeframe'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useSearchParams } from 'next/navigation'

type Props = {
  data: Posts[]
}

function TrendingPosts({ data }: Props) {
  const searchParmas = useSearchParams()
  const timeframe = (searchParmas.get('timeframe') || 'week') as Timeframe
  const { beforeTimeframe, setQuery, posts, isLoading, isLastPage } =
    useTrendingPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  // When timeframe was changed
  useEffect(() => {
    if (beforeTimeframe === timeframe) return
    setQuery({
      limit: 8,
      offset: 0,
      timeframe,
    })
  }, [timeframe, beforeTimeframe, setQuery, posts])

  // infinite scroll
  const getTreningPostsMore = useCallback(() => {
    if (isLastPage) return
    const offset = posts.length
    console.log('offset', offset)
    setQuery({
      limit: 8,
      offset: offset,
      timeframe,
    })
  }, [isLastPage, setQuery, posts.length, timeframe])

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
