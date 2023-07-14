'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { useCallback, useRef } from 'react'
import type { Posts } from '@/types/post'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

type Props = {
  data: Posts[]
}

function TrendingPosts({ data }: Props) {
  const { posts, isLoading, fetchNextPage, isFetching } = useTrendingPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  const getTreningPostsMore = useCallback(() => {
    if (isLoading) return
    fetchNextPage()
  }, [isLoading, fetchNextPage])

  useInfiniteScroll(ref, getTreningPostsMore)
  return (
    <>
      <PostCardGrid
        posts={posts}
        forHome={true}
        forPost={false}
        loading={isLoading || isFetching}
      />
      <div ref={ref} />
    </>
  )
}

export default TrendingPosts
