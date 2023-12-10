import {
  Post,
  SearchPostsDocument,
  SearchPostsQuery,
  SearchPostsQueryVariables,
} from '@/graphql/generated'
import { infiniteSearchPostsQueryKey } from '@/graphql/queryKey'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useMemo } from 'react'

type Args = {
  keyword: string
  username: string
}

export default function useSearchPosts({ keyword, username }: Args) {
  const fetchInput = useMemo(() => {
    return {
      keyword,
      username,
    }
  }, [keyword, username])

  const { data, isLoading, isFetching, fetchMore } = useCustomInfiniteQuery<
    SearchPostsQuery,
    SearchPostsQueryVariables
  >({
    queryKey: infiniteSearchPostsQueryKey({ input: fetchInput }),
    document: SearchPostsDocument,
    initialPageParam: {
      input: fetchInput,
    },
    getNextPageParam: (page) => {
      const { count, posts } = page.searchPosts
      if (!posts) return undefined
      if (posts.length === 0 || count === 0) return undefined
      return {
        keyword,
        username,
        offset: count,
      }
    },
    enabled: !!keyword,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 10,
  })

  const posts = useMemo(
    () => [...(data?.pages?.flatMap((page) => page.searchPosts.posts) || [])] as Post[],
    [data],
  )

  const count = useMemo(() => data?.pages[0].searchPosts.count || 0, [data])

  return {
    posts,
    count,
    isFetching,
    originData: data,
    isLoading,
    fetchMore,
  }
}
