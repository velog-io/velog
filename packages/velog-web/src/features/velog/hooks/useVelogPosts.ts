import { fetcher } from '@/graphql/fetcher'
import {
  Post,
  VelogPostsDocument,
  VelogPostsQuery,
  VelogPostsQueryVariables,
  useInfiniteVelogPostsQuery,
} from '@/graphql/generated'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { unknown } from 'zod'

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

  const { data, fetchNextPage, isFetching, hasNextPage, isError, isLoading, isFetchingNextPage } =
    useInfiniteQuery<VelogPostsQuery>({
      queryKey: ['velogPosts.infinte'],
      queryFn: () => {
        console.log('pageParam')
        return fetcher<VelogPostsQuery, VelogPostsQueryVariables>(VelogPostsDocument, {
          input: fetchInput,
        })()
      },
      gcTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 5,
      initialData: [],
      refetchInterval: 1000,
      refetchOnWindowFocus: false,
      getNextPageParam: (page) => {
        const posts = page.posts
        if (!posts) return undefined
        if (posts.length === 0) return undefined
        if (posts.length < limit) return undefined
        return {
          username,
          tag,
          cursor: posts[posts.length - 1]?.id,
          limit,
        }
      },
    })

  const posts = useMemo(() => {
    return [...initialData, ...(data?.pages?.flatMap((page) => page.posts) || [])] as Post[]
  }, [data, initialData])

  const fetchMore = () => {
    if (isFetching || isError) return
    if (!hasNextPage || !isFetchingNextPage) return
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
