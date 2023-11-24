import { fetcher } from '@/graphql/fetcher'
import {
  GetTrendingWritersDocument,
  GetTrendingWritersQuery,
  GetTrendingWritersQueryVariables,
  TrendingWriter,
} from '@/graphql/generated'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function useTrendingWriters(cursor: number = 0, take: number = 20) {
  const fetchInput = useMemo(() => {
    return {
      cursor,
      take,
    }
  }, [cursor, take])

  const { data, fetchNextPage, isFetching, hasNextPage, isError, isLoading } =
    useInfiniteQuery<GetTrendingWritersQuery>(
      ['getTrendingWriters', { input: fetchInput }],
      ({ pageParam = fetchInput }) =>
        fetcher<GetTrendingWritersQuery, GetTrendingWritersQueryVariables>(
          GetTrendingWritersDocument,
          {
            input: pageParam,
          },
        )(),
      {
        retryDelay: 1000,
        cacheTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 10,
        getNextPageParam: (page) => {
          const { trendingWriters } = page
          if (!trendingWriters) return false

          const { writers } = trendingWriters
          if (writers.length < take) return false
          const cursor = writers[writers.length - 1].index + 1
          return {
            cursor,
            take,
          }
        },
      },
    )

  const trendingWriters = useMemo(() => {
    return [
      ...(data?.pages?.flatMap((page) => page.trendingWriters.writers) || []),
    ] as TrendingWriter[]
  }, [data])

  const fetchMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage) return
    fetchNextPage()
  }

  return {
    trendingWriters,
    isFetching,
    originData: data,
    isInitLoading: isLoading,
    fetchMore,
  }
}
