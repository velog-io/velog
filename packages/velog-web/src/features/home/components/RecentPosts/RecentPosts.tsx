'use client'

import PostCardGrid from '@/features/home/components/PostCardGrid'
import useRecentPosts from '@/features/home/hooks/useRecentPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useRef } from 'react'
import { Post } from '@/graphql/generated'

type Props = {
  data: Post[]
}

function RecentPosts({ data }: Props) {
  const { posts, isFetching, originData, fetchMore } = useRecentPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  useInfiniteScroll(ref, fetchMore)

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
