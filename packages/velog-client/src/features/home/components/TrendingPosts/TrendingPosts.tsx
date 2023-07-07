'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { useEffect } from 'react'
import { Posts } from '@/types/post'
import { useTimeframeValue } from '@/features/home/state/timeframe'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'

type Props = {
  data: Posts[]
}

function TrendingPosts({ data }: Props) {
  const { timeframe } = useTimeframeValue()
  const { loading, posts, fetching } = useTrendingPosts(data)

  useEffect(() => {
    fetching({
      limit: 24,
      offset: 0,
      timeframe,
    })
  }, [timeframe, fetching])

  return (
    <PostCardGrid
      data={posts}
      forHome={true}
      forPost={false}
      loading={loading}
    />
  )
}

export default TrendingPosts
