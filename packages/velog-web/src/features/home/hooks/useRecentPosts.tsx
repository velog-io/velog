import { ENV } from '@/env'
import { fetcher } from '@/graphql/fetcher'
import {
  RecentPostsDocument,
  RecentPostsQuery,
  RecentPostsQueryVariables,
} from '@/graphql/generated'
import { Posts } from '@/types/post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo, useRef } from 'react'

export default function useRecentPosts(initialPosts: Posts[] = []) {
  const hasCheckedRef = useRef<boolean>(false)

  // query
  const limit = ENV.defaultPostLimit
  const fetchInput = useMemo(() => {
    return {
      limit,
      cursor: initialPosts[initialPosts.length - 1]?.id,
    }
  }, [initialPosts, limit])

  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery<RecentPostsQuery>(
    ['recentPosts', { input: fetchInput }],
    ({ pageParam = fetchInput }) =>
      fetcher<RecentPostsQuery, RecentPostsQueryVariables>(RecentPostsDocument, {
        input: pageParam,
      })(),
    {
      retryDelay: 100,
      cacheTime: 1000 * 60 * 1,
      staleTime: 1000 * 60 * 1,
      enabled: hasCheckedRef.current,
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
    return [...initialPosts, ...(data?.pages?.flatMap((page) => page.recentPosts) || [])] as Posts[]
  }, [data, initialPosts])

  return {
    posts,
    fetchNextPage,
    isFetching,
    hasNextPage,
    originData: data,
  }
}
