'use client'

import { fetcher } from '@/graphql/fetcher'
import {
  FollowResult,
  GetFollowingsDocument,
  GetFollowingsQuery,
  GetFollowingsQueryVariables,
} from '@/graphql/generated'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function useFollowings(username: string, limit = 20) {
  const fetchInput = useMemo(() => {
    return {
      username,
      limit,
    }
  }, [username, limit])

  const { data, fetchNextPage, isFetching, hasNextPage, isError, isLoading } =
    useInfiniteQuery<GetFollowingsQuery>(
      ['getFollwings', { input: fetchInput }],
      ({ pageParam = fetchInput }) =>
        fetcher<GetFollowingsQuery, GetFollowingsQueryVariables>(GetFollowingsDocument, {
          input: pageParam,
        })(),
      {
        retryDelay: 3000,
        cacheTime: 1000 * 60 * 3,
        staleTime: 100,
        getNextPageParam: (page) => {
          const { followings } = page
          if (!followings) return false
          if (followings.length < limit) return false
          return {
            username,
            limit,
            cursor: followings[followings.length - 1]?.id,
          }
        },
      },
    )

  const followings = useMemo(() => {
    return [...(data?.pages?.flatMap((page) => page.followings) || [])] as FollowResult[]
  }, [data])

  const fetchMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage) return
    fetchNextPage()
  }

  return {
    followings,
    fetchNextPage,
    isFetching,
    originData: data,
    isLoading,
    fetchMore,
  }
}
