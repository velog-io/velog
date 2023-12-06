'use client'

import PostCardGrid from '@/features/home/components/PostCardGrid'
import useRecentPosts from '@/features/home/hooks/useRecentPosts'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useEffect, useRef, useState } from 'react'
import { Post, RecentPostsQuery } from '@/graphql/generated'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { sleep } from '@/lib/utils'

type Props = {
  data: Post[]
}

function RecentPosts({ data }: Props) {
  const [initialData, setInitialData] = useState<Post[]>([])
  const { posts, isFetching, originData, fetchMore, isLoading } = useRecentPosts(initialData)
  const ref = useRef<HTMLDivElement>(null)

  useInfiniteScroll(ref, fetchMore)

  useEffect(() => {
    setInitialData(data)
  }, [data])

  useEffect(() => {
    const storageKey = 'recentPosts'
    try {
      const infiniteData = localStorage.getItem(storageKey)
      if (!infiniteData) return
      const parsed: InfiniteData<RecentPostsQuery> = JSON.parse(infiniteData)
      const savedPosts = parsed.pages.flatMap((saved) => saved.recentPosts) as Post[]
      setInitialData([...data, ...savedPosts])

      const scrolly = Number(localStorage.getItem(`${storageKey}/scrollPosition`))
      if (!scrolly || isLoading) return
      sleep(1000).then(() => {
        console.log('move')
        window.scrollTo({
          top: Number(scrolly),
          behavior: 'smooth',
        })
      })
    } finally {
      console.log('finall')
      localStorage.removeItem(storageKey)
      localStorage.removeItem(`${storageKey}/scrollPosition`)
    }
  }, [data, isLoading])

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

export default RecentPosts
