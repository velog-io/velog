import { fetcher } from '@/graphql/fetcher'
import {
  RecentPostsDocument,
  RecentPostsQuery,
  RecentPostsQueryVariables,
} from '@/graphql/generated'
import { Posts } from '@/types/post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function useRecentPosts(initialPosts: Posts[] = []) {
  const limit = 12
  const fetchInput = useMemo(() => {
    return {
      limit,
      cursor: initialPosts[initialPosts.length - 1]?.id,
    }
  }, [initialPosts])

  const { data, isLoading, fetchNextPage, isFetching, isRefetching } =
    useInfiniteQuery<RecentPostsQuery>(
      ['recentPosts'],
      ({ pageParam = fetchInput }) =>
        fetcher<RecentPostsQuery, RecentPostsQueryVariables>(
          RecentPostsDocument,
          {
            input: pageParam,
          }
        )(),
      {
        retryDelay: 100,
        cacheTime: 1000 * 60 * 2,
        staleTime: 1000 * 60 * 5,
        getNextPageParam: (page) => {
          const recentPosts = page.recentPosts
          if (!recentPosts) return false
          if (recentPosts && recentPosts?.length < limit) return false
          return {
            limit,
            cursor: recentPosts[recentPosts.length - 1]?.id,
          }
        },
      }
    )

  const posts = useMemo(() => {
    if (isLoading) return []
    return [
      ...initialPosts,
      ...(data?.pages.flatMap((page) => page.recentPosts) || []),
    ] as Posts[]
  }, [data, initialPosts, isLoading])

  return { posts, isLoading, fetchNextPage, isFetching, isRefetching }
}
