import { fetcher } from '@/graphql/fetcher'
import {
  GetFollowersQuery,
  GetFollowersQueryVariables,
  GetFollowingsDocument,
  User,
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
        fetcher<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowingsDocument, {
          input: pageParam,
        })(),
      {
        retryDelay: 3000,
        cacheTime: 1000 * 60 * 3,
        staleTime: 1000 * 60 * 3,
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
    return [...(data?.pages?.flatMap((page) => page.followers) || [])] as User[]
  }, [data])

  return {
    followers,
    fetchNextPage,
    isFetching,
    hasNextPage,
    originData: data,
    isError,
    isInitLoading: isLoading,
  }
}
