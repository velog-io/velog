import {
  FollowResult,
  GetFollowersDocument,
  GetFollowersQuery,
  GetFollowersQueryVariables,
} from '@/graphql/generated'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useMemo } from 'react'

export default function useFollowers(username: string, limit = 10) {
  const fetchInput = useMemo(() => {
    return {
      username,
      limit,
    }
  }, [username, limit])

  const { data, isFetching, isLoading, fetchMore } = useCustomInfiniteQuery<
    GetFollowersQuery,
    GetFollowersQueryVariables
  >({
    queryKey: ['trendingPosts.infinite'],
    document: GetFollowersDocument,
    initialPageParam: {
      input: fetchInput,
    },
    getNextPageParam: (page) => {
      const { followers } = page
      if (!followers) return undefined
      if (followers.length < limit) return undefined
      return {
        username,
        limit,
        cursor: followers[followers.length - 1]?.id,
      }
    },
    retryDelay: 1000, // default
    staleTime: 1000 * 60 * 5,
  })
  const followers = useMemo(() => {
    return [...(data?.pages?.flatMap((page) => page.followers) || [])] as FollowResult[]
  }, [data])

  return {
    followers,
    isFetching,
    originData: data,
    isLoading,
    fetchMore,
  }
}
