import { fetcher } from '@/graphql/fetcher'
import {
  GetTrendingWritersDocument,
  GetTrendingWritersQuery,
  GetTrendingWritersQueryVariables,
  TrendingWriter,
} from '@/graphql/generated'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

export default function useTrendingWriters(initPage: number = 10, take: number = 10) {
  const [page, setPage] = useState(initPage)

  const fetchInput = useMemo(() => {
    return {
      page,
      take,
    }
  }, [page, take])

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
        retryDelay: 500,
        cacheTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 10,
        getNextPageParam: (nextPage) => {
          const { trendingWriters } = nextPage
          if (!trendingWriters) return false

          const { totalPage, writers } = trendingWriters
          if (totalPage === page) return false
          if (writers.length < take) return false

          setPage((state) => state + 1)
          return {
            page,
            take,
          }
        },
      },
    )

  const trendingWriters = useMemo(() => {
    return [
      ...(data?.pages.flatMap((page) => page.trendingWriters.writers) || []),
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
