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
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'

export default function useTrendingPosts(initialPost: Posts[] = []) {
  const params = useParams()
  console.log('params', params)
  const timeframe = (params.timeframe ?? 'week') as Timeframe
  const prevTimeframe = useRef<Timeframe>(timeframe)
  const { actions } = useTimeframe()
  const hasCheckedRef = useRef<boolean>(false)

  // query
  const limit = ENV.defaultPostLimit
  const initialOffset = initialPost.length
  const fetchInput = useMemo(() => {
    return {
      limit,
      offset: initialOffset,
      timeframe,
    }
  }, [initialOffset, timeframe, limit])

  const { data, isLoading, fetchNextPage, refetch, isFetching, hasNextPage, isError } =
    useInfiniteQuery<TrendingPostsQuery>(
      ['trendingPosts', { input: fetchInput }],
      ({ pageParam = fetchInput }) =>
        fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(TrendingPostsDocument, {
          input: pageParam,
        })(),
      {
        retryDelay: 100,
        cacheTime: 1000 * 60 * 3,
        staleTime: 1000 * 60 * 3,
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
      },
    )

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
    return [
      ...initialPost,
      ...(data?.pages?.flatMap((page) => page.trendingPosts) || []),
    ] as Posts[]
  }, [data, initialPost])

  return {
    posts,
    isLoading,
    fetchNextPage,
    isFetching,
    hasNextPage,
    originData: data,
    isError,
  }
}
