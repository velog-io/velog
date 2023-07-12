import { Timeframe } from '@/features/home/state/timeframe'
import { fetcher } from '@/graphql/fetcher'
import {
  TrendingPostsDocument,
  TrendingPostsInput,
  TrendingPostsQuery,
  TrendingPostsQueryVariables,
} from '@/graphql/generated'
import { Posts } from '@/types/post'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function useTrendingPosts(intialPosts: Posts[] = []) {
  const searchParams = useSearchParams()
  const timeframe = (searchParams.get('timeframe') ?? 'week') as Timeframe
  const [posts, setPosts] = useState<Posts[]>(intialPosts)
  const prevTimeFrame = useRef<Timeframe>(timeframe)
  const [fetchPostsInput, fetchNextPosts] = useState<TrendingPostsInput>({
    limit: 3,
    offset: posts.length,
    timeframe,
  })

  const { data, isSuccess, isLoading, refetch } =
    useInfiniteQuery<TrendingPostsQuery>(
      ['trendingPosts', { input: fetchPostsInput }],
      fetcher<TrendingPostsQuery, TrendingPostsQueryVariables>(
        TrendingPostsDocument,
        { input: fetchPostsInput }
      ),
      {
        retryDelay: 400,
      }
    )

  const prevFetchPostsInput = useRef(fetchPostsInput)

  useEffect(() => {
    if (prevTimeFrame.current === timeframe) return
    setPosts([])
    fetchNextPosts({
      limit: Number(process.env.NEXT_PUBLIC_DEFAULT_POST_LIMIT),
      offset: 0,
      timeframe,
    })
    prevTimeFrame.current = fetchPostsInput.timeframe as Timeframe
  }, [fetchPostsInput, timeframe, setPosts, posts.length])

  useEffect(() => {
    if (prevFetchPostsInput.current.offset === fetchPostsInput.offset) return
    prevFetchPostsInput.current = fetchPostsInput
    refetch()
  }, [fetchPostsInput, refetch])

  useEffect(() => {
    if (!isSuccess) return
    const list = data.pages.map((page) => page.trendingPosts).flat() as Posts[]
    setPosts((prev) => [...prev, ...list])
  }, [isSuccess, data])

  return {
    posts,
    isLoading,
    fetchNextPosts,
  }
}
