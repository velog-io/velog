import { ENV } from '@/env'
import {
  FeedPostsDocument,
  FeedPostsQuery,
  FeedPostsQueryVariables,
  Post,
} from '@/graphql/generated'
import { infiniteFeedPostsQueryKey } from '@/graphql/helpers/queryKey'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useMemo } from 'react'

export default function useFeedPosts(initialPosts: Post[] = [], limit = ENV.defaultPostLimit) {
  const fetchInput = useMemo(() => {
    return {
      limit,
      offset: initialPosts.length,
    }
  }, [initialPosts, limit])

  const { data, isLoading, isFetching, fetchMore } = useCustomInfiniteQuery<
    FeedPostsQuery,
    FeedPostsQueryVariables
  >({
    queryKey: infiniteFeedPostsQueryKey({ input: fetchInput }),
    document: FeedPostsDocument,
    enabled: initialPosts.length !== 0,
    initialPageParam: {
      input: fetchInput,
    },
    getNextPageParam: (page, pages) => {
      const feedPosts = page.feedPosts
      if (!feedPosts) return undefined
      if (feedPosts.length < limit) return undefined
      const offset = pages.flatMap((page) => page.feedPosts).length + initialPosts.length
      return {
        limit,
        offset,
      }
    },
    retry: 1000 * 1,
    gcTime: 1000 * 60,
    staleTime: 1000 * 30,
  })

  const posts = useMemo(() => {
    return [...initialPosts, ...(data?.pages?.flatMap((page) => page.feedPosts) || [])] as Post[]
  }, [data, initialPosts])

  return {
    posts,
    isFetching,
    isLoading,
    fetchMore,
  }
}
