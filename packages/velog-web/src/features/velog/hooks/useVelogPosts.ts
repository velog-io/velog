import { fetcher } from '@/graphql/fetcher'
import {
  Post,
  VelogPostsDocument,
  VelogPostsQuery,
  VelogPostsQueryVariables,
} from '@/graphql/generated'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

type Args = {
  username: string
  tag?: string
  initialData: Post[]
}

export default function useVelogPosts({ username, tag, initialData = [] }: Args) {
  const limit = 10
  const fetchInput = useMemo(() => {
    return {
      username,
      tag,
      cursor: initialData[initialData.length - 1]?.id,
      limit,
    }
  }, [username, tag, initialData])

  const { data, fetchNextPage, isFetching, hasNextPage, isError, isLoading } =
    useInfiniteQuery<VelogPostsQuery>(
      ['posts', { input: fetchInput }],
      ({ pageParam = fetchInput }) =>
        fetcher<VelogPostsQuery, VelogPostsQueryVariables>(VelogPostsDocument, {
          input: pageParam,
        })(),
      {
        retryDelay: 100,
        cacheTime: 1000 * 60 * 5,
        staleTime: 1000 * 60 * 5,
        getNextPageParam: (page) => {
          const posts = page.posts
          if (!posts) return false
          if (posts.length === 0) return false
          if (posts.length < limit) return false
          return {
            username,
            tag,
            cursor: posts[posts.length - 1]?.id,
            limit,
          }
        },
      },
    )

  const posts = useMemo(() => {
    return [...initialData, ...(data?.pages?.flatMap((page) => page.posts) || [])] as Post[]
  }, [data, initialData])

  const fetchMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage) return
    fetchNextPage()
  }

  return {
    posts,
    fetchNextPage,
    isFetching,
    hasNextPage,
    originData: data,
    isError,
    isLoading,
    fetchMore,
  }
}
