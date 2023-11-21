import { fetcher } from '@/graphql/fetcher'
import {
  Post,
  SearchPostsDocument,
  SearchPostsQuery,
  SearchPostsQueryVariables,
} from '@/graphql/generated'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

type Args = {
  keyword: string
  username: string
}

export default function useVelogSearchPosts({ keyword, username }: Args) {
  const fetchInput = useMemo(() => {
    return {
      keyword,
      username,
    }
  }, [keyword, username])

  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage = true,
    isError,
    isLoading,
  } = useInfiniteQuery<SearchPostsQuery>(
    ['searchPosts', { input: fetchInput }],
    ({ pageParam = fetchInput }) =>
      fetcher<SearchPostsQuery, SearchPostsQueryVariables>(SearchPostsDocument, {
        input: pageParam,
      })(),
    {
      retryDelay: 100,
      enabled: !!keyword,
      getNextPageParam: (page) => {
        const { count, posts } = page.searchPosts
        if (!posts) return false
        if (posts.length === 0 || count === 0) return false
        return {
          keyword,
          username,
          offset: count,
        }
      },
    },
  )

  const posts = useMemo(() => {
    return [...(data?.pages?.flatMap((page) => page.searchPosts.posts) || [])] as Post[]
  }, [data])

  const count = useMemo(() => {
    return data?.pages[0].searchPosts.count || 0
  }, [data])

  const fetchMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage) return
    fetchNextPage()
  }

  return {
    posts,
    count,
    isFetching,
    originData: data,
    isInitLoading: isLoading,
    fetchMore,
  }
}
