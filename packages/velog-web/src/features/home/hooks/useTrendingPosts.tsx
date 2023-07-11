import {
  Timeframe,
  useTimeframe,
  useTimeframeValue,
} from '@/features/home/state/timeframe'
import { useTrendingPostsQuery } from '@/graphql/generated'
import { Posts } from '@/types/post'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type TrendingPostsInput = {
  limit: number
  offset: number
  timeframe: Timeframe
}

export default function useTrendingPosts(intialPosts: Posts[] = []) {
  const searchParams = useSearchParams()
  const timeframe = searchParams.get('timeframe') || ('week' as Timeframe)
  const [posts, setPosts] = useState<Posts[]>(intialPosts)

  const [input, setInput] = useState<TrendingPostsInput>({
    limit: 8,
    offset: posts.length,
    timeframe: timeframe as Timeframe,
  })
  const [beforeTimeframe, setBeforeTimeframe] = useState<string>(timeframe)
  const { data, isSuccess, isLoading } = useTrendingPostsQuery({ input })
  const [isLastPage, setIsLastPage] = useState(false)

  useEffect(() => {
    if (beforeTimeframe !== input.timeframe) {
      setBeforeTimeframe(input.timeframe)
      setIsLastPage(false)
    }
  }, [input, beforeTimeframe])

  useEffect(() => {
    if (isSuccess) {
      const trendinPosts = data.trendingPosts as Posts[]
      if (trendinPosts.length < input.limit) {
        setIsLastPage(true)
      }
      setPosts((prev) => [...prev, ...trendinPosts])
    }
  }, [isSuccess, data, input.limit])

  const setQuery = (input: TrendingPostsInput) => {
    if (beforeTimeframe !== input.timeframe) {
      setPosts([])
    }
    setInput(input)
  }

  return {
    setQuery,
    posts,
    data,
    isLoading,
    beforeTimeframe,
    isLastPage,
  }
}
