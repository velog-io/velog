import { fetcher } from '@/graphql/fetcher'
import {
  TrendingWritersDocument,
  TrendingWritersQuery,
  TrendingWritersQueryVariables,
  TrendingWriter,
} from '@/graphql/generated'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

type Args = {
  limit?: number
  initialData: TrendingWriter[]
}

export default function useTrendingWriters({ limit = 20, initialData = [] }: Args) {
  const fetchInput = useMemo(() => {
    return {
      cursor: initialData[initialData.length - 1]?.index + 1 ?? 0,
      limit,
    }
  }, [limit, initialData])

  const { data, fetchNextPage, isFetching, hasNextPage, isError, isLoading } =
    useInfiniteQuery<TrendingWritersQuery>(
      ['getTrendingWriters', { input: fetchInput }],
      ({ pageParam = fetchInput }) =>
        fetcher<TrendingWritersQuery, TrendingWritersQueryVariables>(TrendingWritersDocument, {
          input: pageParam,
        })(),
      {
        retryDelay: 1000,
        cacheTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 10,
        getNextPageParam: (page) => {
          const { trendingWriters } = page
          if (!trendingWriters) return false
          if (trendingWriters.length < limit) return false
          const cursor = trendingWriters[trendingWriters.length - 1].index + 1
          return {
            cursor,
            limit,
          }
        },
      },
    )

  const trendingWriters = useMemo(() => {
    return [
      ...initialData,
      ...(data?.pages?.flatMap((page) => page.trendingWriters) || []),
    ] as TrendingWriter[]
  }, [data, initialData])

  const fetchMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage) return
    fetchNextPage()
  }

  return {
    trendingWriters,
    isFetching,
    originData: data,
    isLoading,
    fetchMore,
  }
}
