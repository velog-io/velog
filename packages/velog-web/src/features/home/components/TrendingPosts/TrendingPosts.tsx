'use client'

import PostCardGrid from '@/features/home/components/PostCardGrid'
import { useRef } from 'react'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Post } from '@/graphql/generated'

type Props = {
  data: Post[]
}

function TrendingPosts({ data }: Props) {
  const { posts, isFetching, originData, fetchMore, isLoading } = useTrendingPosts(data)
  const ref = useRef<HTMLDivElement>(null)
  useInfiniteScroll(ref, fetchMore)

  return (
    <>
      <PostCardGrid
        posts={posts}
        originData={originData}
        forHome={true}
        forPost={false}
        isFetching={isFetching}
        isLoading={isLoading}
      />
      <div ref={ref} />
    </>
  )
}

export default TrendingPosts
