'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { useRef } from 'react'
import type { Posts } from '@/types/post'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

type Props = {
  data: Posts[]
}

function TrendingPosts({ data }: Props) {
  const { posts, fetchNextPage, isFetching, hasNextPage, originData } = useTrendingPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  const getTreningPostsMore = () => {
    if (isFetching) return
    if (hasNextPage === false) return
    fetchNextPage()
  }

  useInfiniteScroll(ref, getTreningPostsMore)

  return (
    <>
      <PostCardGrid
        posts={posts}
        originData={originData}
        forHome={true}
        forPost={false}
        loading={isFetching}
      />
      <div style={{ background: 'red', marginTop: 'auto', height: '20px' }} ref={ref} />
    </>
  )
}

export default TrendingPosts
