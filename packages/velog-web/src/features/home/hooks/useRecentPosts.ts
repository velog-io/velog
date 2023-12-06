import { ENV } from '@/env'
import {
  Post,
  RecentPostsDocument,
  RecentPostsQuery,
  RecentPostsQueryVariables,
} from '@/graphql/generated'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'

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
    queryKey: ['recentPosts.infinite'],
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
    gcTime: 1000 * 60 * 1,
    staleTime: 1000 * 60 * 1,
  })

  // TODO: remove Start
  const queryClient = useQueryClient()
  useEffect(() => {
    if (hasCheckedRef.current) return
    hasCheckedRef.current = true

    try {
      const stringPosts = localStorage.getItem('recentPosts')
      if (!stringPosts) return
      const parsed = JSON.parse(stringPosts)
      queryClient.setQueryData(['recentPosts.infinite'], parsed)
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

  return {
    posts,
    isFetching,
    isLoading,
    originData: data,
    fetchMore,
  }
}
