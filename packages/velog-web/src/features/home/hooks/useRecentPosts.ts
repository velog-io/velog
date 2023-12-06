import { ENV } from '@/env'
import {
  Post,
  RecentPostsDocument,
  RecentPostsQuery,
  RecentPostsQueryVariables,
} from '@/graphql/generated'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useMemo, useRef } from 'react'

export default function useRecentPosts(initialPosts: Post[] = [], limit = ENV.defaultPostLimit) {
  const hasCheckedRef = useRef<boolean>(false)

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
    queryKey: ['recentPosts.infinite', { input: fetchInput }],
    document: RecentPostsDocument,
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
    retry: 10,
    staleTime: 1000 * 60 * 3,
  })

  const posts = useMemo(() => {
    return [...initialPosts, ...(data?.pages?.flatMap((page) => page.recentPosts) || [])] as Post[]
  }, [data, initialPosts])

  return {
    posts,
    isFetching,
    isLoading,
    originData: data,
    fetchMore,
  }
}
