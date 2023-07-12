import { Timeframe } from '@/features/home/state/timeframe'
import { fetcher } from '@/graphql/fetcher'
import {
  TrendingPostsDocument,
  TrendingPostsQuery,
  TrendingPostsQueryVariables,
} from '@/graphql/generated'
import { Posts } from '@/types/post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type TrendingPostsInput = {
  limit: number
  offset: number
  timeframe: Timeframe
}

export default function useTrendingPosts(intialPosts: Posts[] = []) {
  const searchParams = useSearchParams()
  const timeframe = (searchParams.get('timeframe') ?? 'week') as Timeframe
  const [posts, setPosts] = useState<Posts[]>(intialPosts)
  const prevTimeFrame = useRef<Timeframe>(timeframe)

  const [fetchPostsInput, fetchNextPosts] = useState<TrendingPostsInput>({
    limit: 0,
    offset: 0,
    timeframe: timeframe as Timeframe,
  })

  const { data, isSuccess, isLoading } = useInfiniteQuery<TrendingPostsQuery>(
    ['trendingPosts', { input: fetchPostsInput }],
    fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(
      TrendingPostsDocument,
      { input: fetchPostsInput }
    ),
    {
      retryDelay: 400,
    }
  )

  useEffect(() => {
    if (prevTimeFrame.current !== timeframe) {
      fetchNextPosts({
        limit: Number(process.env.NEXT_PUBLIC_DEFAULT_LIMIT),
        offset: 0,
        timeframe,
      })
      setPosts([])
      prevTimeFrame.current = fetchPostsInput.timeframe
    }
  }, [fetchPostsInput, timeframe, setPosts])

  useEffect(() => {
    if (isSuccess) {
      const list = data.pages
        .map((page) => page.trendingPosts)
        .flat() as Posts[]
      setPosts((prev) => [...prev, ...list])
    }
  }, [isSuccess, data])

  return {
    posts,
    data,
    isLoading,
    prevTimeFrame,
    fetchNextPosts,
  }
}
