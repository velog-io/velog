'use client'

import { Timeframe } from '@/features/home/state/timeframe'
import { fetcher } from '@/graphql/fetcher'
import {
  TrendingPostsDocument,
  TrendingPostsInput,
  TrendingPostsQuery,
  TrendingPostsQueryVariables,
} from '@/graphql/generated'
import { Posts } from '@/types/post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function useTrendingPosts(initialPosts: Posts[] = []) {
  const searchParams = useSearchParams()
  const timeframe = (searchParams.get('timeframe') ?? 'week') as Timeframe
  const prevTimeFrame = useRef<Timeframe>(timeframe)

  const limit = 12
  const fetchInput = {
    limit,
    offset: initialPosts.length,
    timeframe,
  }

  const {
    data,
    isLoading,
    fetchNextPage,
    refetch,
    isFetching,
    isRefetching,
  } = useInfiniteQuery<TrendingPostsQuery>(
    ['trendingPosts'],
    ({ pageParam = fetchInput }) =>
      fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(
        TrendingPostsDocument,
        {
          input: pageParam,
        }
      )(),
    {
      retryDelay: 100,
      cacheTime: 1000 * 60 * 2,
      staleTime: 1000 * 60 * 5,
      getNextPageParam: (pages, allPages) => {
        if (pages.trendingPosts!.length < limit) return false
        return {
          limit,
          timeframe,
          offset: allPages.flatMap((f) => f.trendingPosts).length,
        }
      },
    }
  )

  useEffect(() => {
    if (prevTimeFrame.current === timeframe) return
    refetch()
    prevTimeFrame.current = timeframe as Timeframe
  }, [timeframe, refetch])

  const posts = useMemo(() => {
    if (isRefetching) return []
    return [
      ...initialPosts,
      ...(data?.pages.flatMap((page) => page.trendingPosts)! || []),
    ] as Posts[]
  }, [data?.pages, initialPosts, isRefetching])

  return {
    posts: posts,
    isLoading,
    fetchNextPage,
    isFetching,
    isRefetching,
  }
}
