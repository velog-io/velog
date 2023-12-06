'use client'

import {
  FollowResult,
  GetFollowingsDocument,
  GetFollowingsQuery,
  GetFollowingsQueryVariables,
} from '@/graphql/generated'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useMemo } from 'react'

export default function useFollowings(username: string, limit = 20) {
  const fetchInput = useMemo(() => {
    return {
      username,
      limit,
    }
  }, [username, limit])

  const { data, isLoading, isFetching, fetchMore } = useCustomInfiniteQuery<
    GetFollowingsQuery,
    GetFollowingsQueryVariables
  >({
    queryKey: ['getFollowings.infinite'],
    document: GetFollowingsDocument,
    initialPageParam: {
      input: fetchInput,
    },
    getNextPageParam: (page) => {
      const { followings } = page
      if (!followings) return undefined
      if (followings.length < limit) return undefined
      return {
        username,
        limit,
        cursor: followings[followings.length - 1]?.id,
      }
    },
    retryDelay: 1000,
    staleTime: 1000 * 60 * 1,
  })

  const followings = useMemo(() => {
    return [...(data?.pages?.flatMap((page) => page.followings) || [])] as FollowResult[]
  }, [data])

  return {
    followings,
    isFetching,
    originData: data,
    isLoading,
    fetchMore,
  }
}
