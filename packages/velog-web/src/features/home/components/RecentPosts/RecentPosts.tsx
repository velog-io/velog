'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import useRecentPosts from '@/features/home/hooks/useRecentPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useRef } from 'react'
import { Post } from '@/graphql/generated'

type Props = {
  data: Post[]
}

function RecentPosts({ data }: Props) {
  const { posts, fetchNextPage, isFetching, hasNextPage, originData, isError } =
    useRecentPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  const getRecentPostsMore = () => {
    if (isFetching || isError) return
    if (hasNextPage === false) return
    fetchNextPage()
  }

  useInfiniteScroll(ref, getRecentPostsMore, isError)

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
