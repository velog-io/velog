'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import useRecentPosts from '@/features/home/hooks/useRecentPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import type { Posts } from '@/types/post'
import { useRef } from 'react'

type Props = {
  data: Posts[]
}

function RecentPosts({ data }: Props) {
  const { posts, fetchNextPage, isFetching, hasNextPage, originData } = useRecentPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  const getRecentPostsMore = () => {
    if (isFetching) return
    if (hasNextPage === false) return
    fetchNextPage()
  }

  useInfiniteScroll(ref, getRecentPostsMore)

  return (
    <>
      <PostCardGrid
        posts={posts}
        originData={originData}
        forHome={true}
        forPost={false}
        loading={isFetching}
      />
      <div ref={ref} />
    </>
  )
}

export default RecentPosts
