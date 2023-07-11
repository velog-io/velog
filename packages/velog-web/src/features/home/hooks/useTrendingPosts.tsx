import { Timeframe } from '@/features/home/state/timeframe'
import { useTrendingPostsQuery } from '@/graphql/generated'
import { Posts } from '@/types/post'
import { useCallback, useEffect, useState } from 'react'

type TrendingPostsInput = {
  limit: number
  offset: number
  timeframe: Timeframe
}

if (!process.env.NEXT_PUBLIC_DEFAULT_TIMEFRAME) {
  throw new Error('please set default timeframe')
}

export default function useTrendingPosts(intialPosts: Posts[] = []) {
  const [input, setInput] = useState({
    limit: 1,
    offset: 0,
    timeframe: process.env.NEXT_PUBLIC_DEFAULT_TIMEFRAME!,
  })
  const [beforeTimeframe, setBeforeTimeframe] = useState<string>(
    process.env.NEXT_PUBLIC_DEFAULT_TIMEFRAME!
  )
  const [posts, setPosts] = useState<Posts[]>(intialPosts)
  const { data, isSuccess, isLoading } = useTrendingPostsQuery({ input })

  useEffect(() => {
    if (beforeTimeframe !== input.timeframe) {
      setBeforeTimeframe(input.timeframe)
      setPosts([])
    }
  }, [input, beforeTimeframe])

  useEffect(() => {
    if (isSuccess) {
      setPosts((prev) => [...prev, ...(data.trendingPosts as Posts[])])
    }
  }, [isSuccess, data])

  return { setInput, posts, data, isLoading, beforeTimeframe }
}
