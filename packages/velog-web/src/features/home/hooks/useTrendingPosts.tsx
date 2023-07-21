'use client'

import { ENV } from '@/env'
import { Timeframe, useTimeframe } from '@/features/home/state/timeframe'
import { fetcher } from '@/graphql/fetcher'
import {
  TrendingPostsDocument,
  TrendingPostsQuery,
  TrendingPostsQueryVariables,
} from '@/graphql/generated'
import { Posts } from '@/types/post'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

export default function useTrendingPosts(initialData: Posts[] = []) {
  const searchParams = useSearchParams()
  const timeframe = (searchParams.get('timeframe') ?? 'week') as Timeframe
  const prevTimeFrame = useRef<Timeframe>(timeframe)
  const { actions } = useTimeframe()
  const hasCheckedRef = useRef(false)

  const limit = ENV.defaultPostLimit
  const initialOffset = initialData.length
  const fetchInput = useMemo(() => {
    return {
      limit,
      offset: initialOffset,
      timeframe,
    }
  }, [initialOffset, timeframe, limit])

  const { data, isLoading, fetchNextPage, refetch, isFetching, isRefetching, hasNextPage } =
    useInfiniteQuery<TrendingPostsQuery>(
      ['trendingPosts', { input: fetchInput }],
      ({ pageParam = fetchInput }) =>
        fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(TrendingPostsDocument, {
          input: pageParam,
        })(),
      {
        retryDelay: 100,
        cacheTime: 1000 * 60 * 2,
        staleTime: 1000 * 60 * 2,
        enabled: hasCheckedRef.current,
        getNextPageParam: (pages, allPages) => {
          const trendingPosts = pages.trendingPosts
          if (!trendingPosts) return false
          if (trendingPosts.length < limit) return false

          const offset = allPages.flatMap((pages) => pages.trendingPosts).length + initialOffset
          return {
            limit,
            offset,
            timeframe,
          }
        },
      }
    )

  // TODO: remove Start
  const queryClient = useQueryClient()
  useEffect(() => {
    if (hasCheckedRef.current) return
    hasCheckedRef.current = true
    try {
      const jsonString = localStorage.getItem(`trendingPosts/${timeframe}`)
      if (!jsonString) return
      const parsed = JSON.parse(jsonString)
      queryClient.setQueryData(['trendingPosts', { input: fetchInput }], parsed)
    } catch (_) {}
  }, [queryClient, fetchInput, data, timeframe, isLoading])

  useEffect(() => {
    const scrolly = Number(localStorage.getItem('scrollPosition'))
    if (!scrolly || isLoading) return
    window.scrollTo({
      top: Number(scrolly),
    })
    localStorage.removeItem(`trendingPosts/${timeframe}`)
    localStorage.removeItem('scrollPosition')
  }, [isLoading, timeframe])
  // TODO: remove END

  useEffect(() => {
    if (prevTimeFrame.current === timeframe) return
    refetch()
    prevTimeFrame.current = timeframe as Timeframe
  }, [timeframe, refetch, data])

  useEffect(() => {
    if (isFetching) {
      actions.setIsFetching(true)
    } else {
      actions.setIsFetching(false)
    }
  }, [isFetching, actions])

  const posts = useMemo(() => {
    return [
      ...initialData,
      ...(data?.pages?.flatMap((page) => page.trendingPosts) || []),
    ] as Posts[]
  }, [data, initialData])

  return {
    posts,
    isLoading,
    fetchNextPage,
    isFetching,
    isRefetching,
    hasNextPage,
    originData: data,
  }
}
