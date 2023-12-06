'use client'

import PostCardGrid from '@/features/home/components/PostCardGrid'
import { useEffect, useRef, useState } from 'react'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { Post, TrendingPostsQuery } from '@/graphql/generated'
import { useParams } from 'next/navigation'
import { Timeframe } from '../../state/timeframe'
import { InfiniteData } from '@tanstack/react-query'

type Props = {
  data: Post[]
}

function TrendingPosts({ data }: Props) {
  const params = useParams()
  const timeframe = (params.timeframe ?? 'week') as Timeframe

  const [initialData, setInitialData] = useState<Post[]>([])
  const { posts, isFetching, originData, fetchMore, isLoading } = useTrendingPosts(initialData)
  const ref = useRef<HTMLDivElement>(null)

  useInfiniteScroll(ref, fetchMore)

  useEffect(() => {
    setInitialData(data)
  }, [data])

  useEffect(() => {
    const storageKey = `trendingPosts/${timeframe}`
    try {
      const infiniteData = localStorage.getItem(`trendingPosts/${timeframe}`)
      if (!infiniteData) return

      const parsed: InfiniteData<TrendingPostsQuery> = JSON.parse(infiniteData)
      const savedPosts = parsed.pages.flatMap((saved) => saved.trendingPosts) as Post[]
      setInitialData([...data, ...savedPosts])

      const scrolly = Number(localStorage.getItem(`${storageKey}/scrollPosition`))
      if (!scrolly || isLoading) return
      window.scrollTo({
        top: Number(scrolly),
      })
    } finally {
      localStorage.removeItem(storageKey)
      localStorage.removeItem(`${storageKey}/scrollPosition`)
    }
  }, [data, timeframe, isLoading])

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
