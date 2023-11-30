import { fetcher } from '@/graphql/fetcher'
import {
  FollowResult,
  GetFollowersDocument,
  GetFollowersQuery,
  GetFollowersQueryVariables,
} from '@/graphql/generated'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function useFollowers(username: string, limit = 1) {
  const fetchInput = useMemo(() => {
    return {
      username,
      limit,
    }
  }, [username, limit])

  const { data, fetchNextPage, isFetching, hasNextPage, isError, isLoading } =
    useInfiniteQuery<GetFollowersQuery>(
      ['getFollwings', { input: fetchInput }],
      ({ pageParam = fetchInput }) =>
        fetcher<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, {
          input: pageParam,
        })(),
      {
        retryDelay: 3000,
        cacheTime: 1000 * 60 * 3,
        staleTime: 100,
        getNextPageParam: (page) => {
          const { followers } = page
          if (!followers) return false
          if (followers.length < limit) return false
          return {
            username,
            limit,
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
    isLoading,
    fetchMore,
  }
}
