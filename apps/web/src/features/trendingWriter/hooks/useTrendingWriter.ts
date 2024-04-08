import {
  TrendingWritersDocument,
  TrendingWritersQuery,
  TrendingWritersQueryVariables,
  TrendingWriter,
} from '@/graphql/server/generated/server'
import { infiniteTrendingWritersQueryKey } from '@/graphql/server/helpers/queryKey'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
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

  const { data, isFetching, isLoading, fetchMore } = useCustomInfiniteQuery<
    TrendingWritersQuery,
    TrendingWritersQueryVariables
  >({
    queryKey: infiniteTrendingWritersQueryKey({ input: fetchInput }),
    document: TrendingWritersDocument,
    initialPageParam: {
      input: fetchInput,
    },
    getNextPageParam: (page) => {
      const { trendingWriters } = page
      if (!trendingWriters) return undefined
      if (trendingWriters.length < limit) return undefined
      const cursor = trendingWriters[trendingWriters.length - 1].index + 1
      return {
        cursor,
        limit,
      }
    },
    retryDelay: 1000,
    gcTime: 1000 * 60 * 10,
    staleTime: 1000 * 60 * 10,
  })

  const trendingWriters = useMemo(() => {
    return [
      ...initialData,
      ...(data?.pages?.flatMap((page) => page.trendingWriters) || []),
    ] as TrendingWriter[]
  }, [data, initialData])

  return {
    trendingWriters,
    isFetching,
    originData: data,
    isLoading,
    fetchMore,
  }
}
