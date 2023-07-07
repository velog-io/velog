'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { Suspense, useEffect, useRef } from 'react'
import { Posts } from '@/types/post'
import { useTimeframeValue } from '@/features/home/state/timeframe'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'

type Props = {
  data: Posts[]
}

function TrendingPosts({ data }: Props) {
  const { timeframe } = useTimeframeValue()
  const { loading, posts, fetching } = useTrendingPosts()
  const hasFetching = useRef<boolean>(false)

  useEffect(() => {
    if (hasFetching) return
    fetching({
      limit: 24,
      offset: 0,
      timeframe,
    })
  }, [timeframe, fetching])

  useEffect(() => {
    hasFetching.current = true
  }, [])

  return (
    <Suspense>
      <PostCardGrid
        data={[...data, ...posts]}
        forHome={true}
        forPost={false}
        loading={loading}
      />
    </Suspense>
  )
}

export default TrendingPosts
