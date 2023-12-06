import { ENV } from '@/env'
import { Timeframe, useTimeframe } from '@/features/home/state/timeframe'
import {
  Post,
  TrendingPostsDocument,
  TrendingPostsQuery,
  TrendingPostsQueryVariables,
} from '@/graphql/generated'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

export default function useTrendingPosts(initialPost: Post[] = [], limit = ENV.defaultPostLimit) {
  const params = useParams()
  const timeframe = (params.timeframe ?? 'week') as Timeframe
  const prevTimeframe = useRef<Timeframe>(timeframe)
  const { actions } = useTimeframe()
  const hasCheckedRef = useRef<boolean>(false)

  // query
  const initialOffset = initialPost.length
  const fetchInput = useMemo(() => {
    return {
      limit,
      offset: initialOffset,
      timeframe,
    }
  }, [initialOffset, timeframe, limit])

  const { data, isLoading, isFetching, fetchMore, refetch } = useCustomInfiniteQuery<
    TrendingPostsQuery,
    TrendingPostsQueryVariables
  >({
    queryKey: ['trendingPosts.infinite'],
    document: TrendingPostsDocument,
    initialPageParam: {
      input: fetchInput,
    },
    getNextPageParam: (page, pages) => {
      const trendingPosts = page.trendingPosts
      if (!trendingPosts) return undefined
      if (trendingPosts.length < limit) return undefined

      const offset = pages.flatMap((page) => page.trendingPosts).length + initialOffset
      return {
        limit,
        offset,
        timeframe,
      }
    },
    retryDelay: 100,
    gcTime: 1000 * 60 * 5, // default
    staleTime: 1000 * 60 * 3,
  })

  // TODO: remove Start
  const queryClient = useQueryClient()
  useEffect(() => {
    if (hasCheckedRef.current) return
    hasCheckedRef.current = true
    try {
      const stringPosts = localStorage.getItem(`trendingPosts/${timeframe}`)
      if (!stringPosts) return
      const parsed = JSON.parse(stringPosts)
      queryClient.setQueryData(['trendingPosts', { input: fetchInput }], parsed)
    } catch (_) {}
  }, [queryClient, fetchInput, timeframe])

  useEffect(() => {
    const storageKey = `trendingPosts/${timeframe}`
    const scrolly = Number(localStorage.getItem(`${storageKey}/scrollPosition`))
    if (!scrolly || isLoading) return
    window.scrollTo({
      top: Number(scrolly),
    })
    localStorage.removeItem(storageKey)
    localStorage.removeItem(`${storageKey}/scrollPosition`)
  }, [timeframe, isLoading])
  // TODO: remove END

  useEffect(() => {
    if (prevTimeframe.current === timeframe) return
    refetch()
    prevTimeframe.current = timeframe as Timeframe
  }, [timeframe, refetch, data])

  // InActive timeframe picker, if isFetching is true
  useEffect(() => {
    if (isFetching) {
      actions.setIsFetching(true)
    } else {
      actions.setIsFetching(false)
    }
  }, [isFetching, actions])

  const posts = useMemo(() => {
    return [...initialPost, ...(data?.pages?.flatMap((page) => page.trendingPosts) || [])] as Post[]
  }, [data, initialPost])

  return {
    posts,
    isLoading,
    isFetching,
    originData: data,
    fetchMore,
  }
}
