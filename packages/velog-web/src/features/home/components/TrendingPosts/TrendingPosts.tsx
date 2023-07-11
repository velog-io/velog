'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Posts } from '@/types/post'
import { useTimeframeValue } from '@/features/home/state/timeframe'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import PostCardSkeletonGrid from '@/features/post/components/PostCardGrid/PostCardSkeletonGrid'
import { useTrendingPostsQuery } from '@/graphql/generated'

type Props = {
  data: Posts[]
  items?: any[]
}

function TrendingPosts({ items = [] }: Props) {
  const { timeframe } = useTimeframeValue()
  const { beforeTimeframe, setInput, posts, isLoading } =
    useTrendingPosts(items)

  useEffect(() => {
    // if (beforeTimeframe === timeframe) return
    setInput({
      limit: 2,
      offset: 0,
      timeframe,
    })
  }, [timeframe, beforeTimeframe, setInput])

  const onFetchMore = () => {
    const offset = posts.length
    setInput({
      limit: 2,
      offset: offset,
      timeframe: timeframe,
    })
  }
  return (
    <>
      <PostCardGrid
        data={posts}
        forHome={true}
        forPost={false}
        loading={isLoading}
      />
      <button onClick={onFetchMore}>Fetch More</button>
      {isLoading && <div>Loading...</div>}
    </>
  )
}

export default TrendingPosts
