import { ENV } from '@/env'
import { fetcher } from '@/graphql/fetcher'
import {
  Post,
  RecentPostsDocument,
  RecentPostsQuery,
  RecentPostsQueryVariables,
} from '@/graphql/generated'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'

export default function useRecentPosts(initialPosts: Post[] = []) {
  const hasCheckedRef = useRef<boolean>(false)

  // query
  const limit = ENV.defaultPostLimit
  const fetchInput = useMemo(() => {
    return {
      limit,
      cursor: initialPosts[initialPosts.length - 1]?.id,
    }
  }, [initialPosts, limit])

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetching,
    hasNextPage = true,
    isError,
  } = useInfiniteQuery<RecentPostsQuery>(
    ['recentPosts', { input: fetchInput || {} }],
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
    },
  )

  // TODO: remove Start
  const queryClient = useQueryClient()
  useEffect(() => {
    if (hasCheckedRef.current) return
    hasCheckedRef.current = true

    try {
      const stringPosts = localStorage.getItem('recentPosts')
      if (!stringPosts) return
      const parsed = JSON.parse(stringPosts)
      queryClient.setQueriesData(['recentPosts', { input: fetchInput }], parsed)
    } catch (_) {}
  }, [queryClient, fetchInput])

  useEffect(() => {
    const scrolly = Number(localStorage.getItem('recentPosts/scrollPosition'))
    if (!scrolly || isLoading) return
    window.scrollTo({
      top: Number(scrolly),
    })
    localStorage.removeItem('recentPosts')
    localStorage.removeItem('recentPosts/scrollPosition')
  }, [isLoading])
  // TODO: remove End

  const posts = useMemo(() => {
    return [...initialPosts, ...(data?.pages?.flatMap((page) => page.recentPosts) || [])] as Post[]
  }, [data, initialPosts])

  const fetchMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage) return
    fetchNextPage()
  }

  return {
    posts,
    isFetching,
    isLoading,
    originData: data,
    fetchMore,
  }
}
