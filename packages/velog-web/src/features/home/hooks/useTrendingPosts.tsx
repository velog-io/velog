'use client'

import { Timeframe, useTimeframe } from '@/features/home/state/timeframe'
import { fetcher } from '@/graphql/fetcher'
import {
  TrendingPostsDocument,
  TrendingPostsQuery,
  TrendingPostsQueryVariables,
} from '@/graphql/generated'
import { Posts } from '@/types/post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

export default function useTrendingPosts(initialPosts: Posts[] = []) {
  const searchParams = useSearchParams()
  const timeframe = (searchParams.get('timeframe') ?? 'week') as Timeframe
  const prevTimeFrame = useRef<Timeframe>(timeframe)
  const { actions } = useTimeframe()

  const limit = 12
  const fetchInput = useMemo(() => {
    return {
      limit,
      offset: initialPosts.length,
      timeframe,
    }
  }, [initialPosts.length, timeframe])

  const { data, isLoading, fetchNextPage, refetch, isFetching, isRefetching } =
    useInfiniteQuery<TrendingPostsQuery>(
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
        staleTime: 1000 * 60 * 2,
        getNextPageParam: (pages, allPages) => {
          const trendingPosts = pages.trendingPosts
          if (!trendingPosts) return false
          if (trendingPosts.length < limit) return false
          const offset =
            allPages.flatMap((pages) => pages.trendingPosts).length +
            initialPosts.length

          return {
            limit,
            offset,
            timeframe,
          }
        },
      }
    )

  useEffect(() => {
    if (prevTimeFrame.current === timeframe) return
    refetch()
    prevTimeFrame.current = timeframe as Timeframe
  }, [timeframe, refetch])

  useEffect(() => {
    if (isRefetching) {
      actions.setLoading(true)
    } else {
      actions.setLoading(false)
    }
  }, [isRefetching, actions])

  const posts = useMemo(() => {
    if (isRefetching) return []

    return [
      ...initialPosts,
      ...(data?.pages.flatMap((page) => page.trendingPosts) || []),
    ] as Posts[]
  }, [data?.pages, initialPosts, isRefetching])

  return {
    posts,
    isLoading,
    fetchNextPage,
    isFetching,
    isRefetching,
  }
}
