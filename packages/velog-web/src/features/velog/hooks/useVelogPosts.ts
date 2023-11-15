import { fetcher } from '@/graphql/fetcher'
import { Post, PostsDocument, PostsQuery, PostsQueryVariables } from '@/graphql/generated'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

type Args = {
  username: string
  tag?: string
}

export default function useVelogPosts({ username, tag }: Args) {
  const fetchInput = useMemo(() => {
    return {
      username,
      tag,
    }
  }, [username, tag])

  const { data, fetchNextPage, isFetching, hasNextPage, isError, isLoading } =
    useInfiniteQuery<PostsQuery>(
      ['posts', { input: fetchInput }],
      ({ pageParam = fetchInput }) =>
        fetcher<PostsQuery, PostsQueryVariables>(PostsDocument, { input: pageParam })(),
      {
        retryDelay: 100,
        cacheTime: 1000 * 60 * 1,
        staleTime: 1000 * 60 * 1,
        getNextPageParam: (page) => {
          const posts = page.posts
          if (!posts) return false
          if (posts.length === 0) return false
          return {
            username,
            tag,
            cursor: posts[posts.length - 1]?.id,
          }
        },
      },
    )

  const posts = useMemo(() => {
    return [...(data?.pages?.flatMap((page) => page.posts) || [])] as Post[]
  }, [data])

  return {
    posts,
    fetchNextPage,
    isFetching,
    hasNextPage,
    originData: data,
    isError,
    isInitLoading: isLoading,
  }
}
