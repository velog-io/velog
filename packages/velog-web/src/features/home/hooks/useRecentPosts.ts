import { ENV } from '@/env'
import {
  Post,
  RecentPostsDocument,
  RecentPostsQuery,
  RecentPostsQueryVariables,
} from '@/graphql/generated'
import { infiniteRecentPostsQueryKey } from '@/graphql/queryKey'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useMemo } from 'react'

export default function useRecentPosts(initialPosts: Post[] = [], limit = ENV.defaultPostLimit) {
  // query
  const fetchInput = useMemo(() => {
    return {
      limit,
      cursor: initialPosts[initialPosts.length - 1]?.id,
    }
  }, [initialPosts, limit])

  const { data, isLoading, isFetching, fetchMore } = useCustomInfiniteQuery<
    RecentPostsQuery,
    RecentPostsQueryVariables
  >({
    queryKey: infiniteRecentPostsQueryKey({ input: fetchInput }),
    document: RecentPostsDocument,
    enabled: initialPosts.length !== 0,
    initialPageParam: {
      input: fetchInput,
    },
    getNextPageParam: (page) => {
      const recentPosts = page.recentPosts
      if (!recentPosts) return undefined
      if (recentPosts.length < limit) return undefined
      return {
        limit,
        cursor: recentPosts[recentPosts.length - 1].id,
      }
    },
    retry: 1000 * 1,
    gcTime: 1000 * 60,
    staleTime: 1000 * 30,
  })

  const posts = useMemo(() => {
    return [...initialPosts, ...(data?.pages?.flatMap((page) => page.recentPosts) || [])] as Post[]
  }, [data, initialPosts])

  return {
    posts,
    isFetching,
    isLoading,
    fetchMore,
  }
}
