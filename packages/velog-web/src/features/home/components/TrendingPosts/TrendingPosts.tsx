'use client'

import PostCardGrid from '@/features/post/components/PostCardGrid'
import { useRef } from 'react'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Post } from '@/graphql/generated'
import { AdsQueryResult } from '@/actions/getAds'

type Props = {
  data: (Post | AdsQueryResult)[]
}

function TrendingPosts({ data }: Props) {
  const { posts, fetchNextPage, isFetching, hasNextPage, originData, isError } =
    useTrendingPosts(data)
  const ref = useRef<HTMLDivElement>(null)

  const getTreningPostsMore = () => {
    if (isFetching || isError) return
    if (hasNextPage === false) return
    fetchNextPage()
  }

  useInfiniteScroll(ref, getTreningPostsMore, isError)

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

export default TrendingPosts
