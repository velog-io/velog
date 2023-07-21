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

export default function useTrendingPosts(initialPosts: Posts[] = []) {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const timeframe = (searchParams.get('timeframe') ?? 'week') as Timeframe
  const prevTimeFrame = useRef<Timeframe>(timeframe)
  const { actions } = useTimeframe()
  const hasCheckedRef = useRef(false)

  const limit = ENV.defaultPostLimit
  const initialOffset = initialPosts.length
  const fetchInput = useMemo(() => {
    return {
      limit,
      offset: initialOffset,
      timeframe,
    }
  }, [initialOffset, timeframe, limit])

  const { data, isLoading, fetchNextPage, refetch, isFetching, isRefetching, hasNextPage } =
    useInfiniteQuery<TrendingPostsQuery>(
      ['trendingPosts', timeframe],
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

  useEffect(() => {
    if (!data) return
    const serialized = JSON.stringify(data)
    localStorage.setItem(`trendingPosts/${timeframe}`, serialized)
  }, [data, queryClient, timeframe])

  useEffect(() => {
    if (hasCheckedRef.current) return
    hasCheckedRef.current = true

    const shouldRestore = window.scrollY > 100

    if (shouldRestore) {
      try {
        const jsonString = localStorage.getItem(`trendingPosts/${timeframe}`)
        if (!jsonString) return
        const parsed = JSON.parse(jsonString)
        queryClient.setQueryData(['trendingPosts', timeframe], parsed)
      } catch (e) {}
    }
  }, [queryClient, timeframe])

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
    if (isLoading) return initialPosts
    return [
      ...initialPosts,
      ...(data?.pages.flatMap((page) => page.trendingPosts) || []),
    ] as Posts[]
  }, [data, initialPosts, isLoading])

  useEffect(() => {
    const scrolly = Number(localStorage.getItem('scrollPosition'))
    const scrollHight = document.documentElement.scrollHeight

    if (!scrolly) return
    if (scrollHight < scrolly || scrollY < 100) return

    window.scrollTo({
      top: Number(scrolly),
    })

    localStorage.removeItem('scrollPosition')
  }, [posts.length])

  return {
    posts,
    isLoading,
    fetchNextPage,
    isFetching,
    isRefetching,
    hasNextPage,
  }
}
