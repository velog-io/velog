import { fetcher } from '@/graphql/fetcher'
import {
  FollowResult,
  GetFollowersDocument,
  GetFollowersQuery,
  GetFollowersQueryVariables,
} from '@/graphql/generated'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function useFollowers(username: string, take = 1) {
  const fetchInput = useMemo(() => {
    return {
      username,
      take,
    }
  }, [username, take])

  const { data, fetchNextPage, isFetching, hasNextPage, isError, isLoading } =
    useInfiniteQuery<GetFollowersQuery>(
      ['getFollwings', { input: fetchInput }],
      ({ pageParam = fetchInput }) =>
        fetcher<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, {
          input: pageParam,
        })(),
      {
        retryDelay: 3000,
        cacheTime: 0,
        staleTime: 0,
        getNextPageParam: (page) => {
          const { followers } = page
          if (!followers) return false
          if (followers.length < take) return false
          return {
            username,
            take,
            cursor: followers[followers.length - 1]?.id,
          }
        },
      },
    )

  const followers = useMemo(() => {
    return [...(data?.pages?.flatMap((page) => page.followers) || [])] as FollowResult[]
  }, [data])

  const fetchMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage) return
    fetchNextPage()
  }

  return {
    followers,
    isFetching,
    originData: data,
    isInitLoading: isLoading,
    fetchMore,
  }
}
