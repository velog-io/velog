import { fetcher } from '@/graphql/helpers/fetcher'
import { Exact } from '@/graphql/generated'
import {
  InfiniteData,
  UndefinedInitialDataInfiniteOptions,
  useInfiniteQuery,
} from '@tanstack/react-query'

export default function useCustomInfiniteQuery<
  TQueryFnData,
  TVariables extends Variables,
  TData = InfiniteData<TQueryFnData>,
  TError = Error,
>({ document, initialPageParam, ...options }: Args<TQueryFnData, TData, TError, TVariables>) {
  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isError,
    isLoading,
    refetch,
    isRefetching,
  } = useInfiniteQuery<TQueryFnData, TError, TData>(
    (() => {
      const { queryKey, ...rest } = options
      return {
        ...rest,
        queryKey,
        queryFn: ({ pageParam }) =>
          fetcher<TQueryFnData, TVariables>(document, { input: pageParam } as TVariables)(),
        initialPageParam: initialPageParam.input,
      }
    })(),
  )

  const fetchMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage) return
    fetchNextPage()
  }

  return {
    data,
    isLoading,
    isFetching,
    refetch,
    fetchMore,
    isRefetching,
  }
}

type Args<TQueryFnData, TData, TError, TVariables> = {
  document: string
  initialPageParam: TVariables
} & Omit<UndefinedInitialDataInfiniteOptions<TQueryFnData, TError, TData>, 'initialData'>

type Variables = Exact<{ input: any }>
