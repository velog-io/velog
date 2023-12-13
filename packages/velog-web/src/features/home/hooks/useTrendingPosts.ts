import { ENV } from '@/env'
import { Timeframe, useTimeframe } from '@/features/home/state/timeframe'
import {
  Post,
  TrendingPostsDocument,
  TrendingPostsQuery,
  TrendingPostsQueryVariables,
} from '@/graphql/generated'
import { infiniteTrendingPostsQueryKey } from '@/graphql/queryKey'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

export default function useTrendingPosts(initialPost: Post[] = [], limit = ENV.defaultPostLimit) {
  const params = useParams()
  const timeframe = (params.timeframe ?? 'week') as Timeframe
  const prevTimeframe = useRef<Timeframe>(timeframe)
  const { actions } = useTimeframe()

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
    queryKey: infiniteTrendingPostsQueryKey({ input: fetchInput }),
    document: TrendingPostsDocument,
    enabled: initialOffset !== 0,
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
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5,
  })

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
    fetchMore,
  }
}
