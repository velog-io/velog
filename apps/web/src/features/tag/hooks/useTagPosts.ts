import {
  Post,
  VelogPostsDocument,
  VelogPostsQuery,
  VelogPostsQueryVariables,
} from '@/graphql/server/generated/server'
import { infiniteVelogPostsQueryKey } from '@/graphql/server/helpers/queryKey'
import useCustomInfiniteQuery from '@/hooks/useCustomInfiniteQuery'
import { useMemo } from 'react'

type Args = {
  tag: string
  initialData: Post[]
  limit?: number
}

export default function useTagPosts({ tag, initialData, limit = 20 }: Args) {
  const fetchInput = useMemo(() => {
    return {
      cursor: initialData[initialData.length - 1]?.id,
      tag,
      limit,
    }
  }, [tag, limit, initialData])

  const { data, fetchMore, isFetching, isLoading } = useCustomInfiniteQuery<
    VelogPostsQuery,
    VelogPostsQueryVariables
  >({
    queryKey: infiniteVelogPostsQueryKey({ input: fetchInput }),
    document: VelogPostsDocument,
    initialPageParam: {
      input: {
        cursor: initialData[initialData.length - 1]?.id,
        tag,
        limit,
      },
    },
    getNextPageParam: (page) => {
      const { posts } = page
      if (!posts) return undefined
      if (posts.length < limit) return undefined
      return {
        tag,
        cursor: posts[posts.length - 1]?.id,
        limit,
      }
    },
  })

  const posts = useMemo(() => {
    return [...initialData, ...(data?.pages?.flatMap((page) => page.posts) ?? [])] as Post[]
  }, [data, initialData])

  return {
    posts,
    originData: data,
    isLoading,
    isFetching,
    fetchMore,
  }
}
