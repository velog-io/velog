'use client'

import PostCardGrid from '@/features/home/components/PostCardGrid'
import { useEffect, useRef, useState } from 'react'
import useTrendingPosts from '@/features/home/hooks/useTrendingPosts'
import { Post } from '@/graphql/generated'
import { redirect, useParams } from 'next/navigation'
import { Timeframe } from '../../state/timeframe'

type Props = {
  data: Post[]
}

function TrendingPosts({ data }: Props) {
  const params = useParams()

  const timeframe = (params.timeframe ?? 'week') as Timeframe
  const hasEffectRun = useRef<boolean>(false)

  const [initialData, setInitialData] = useState<Post[]>([])
  const { posts, isFetching, fetchMore, isLoading } = useTrendingPosts(initialData)

  useEffect(() => {
    if (hasEffectRun.current) return
    hasEffectRun.current = true
    let timeout: NodeJS.Timeout
    const storageKey = `trendingPosts/${timeframe}`
    try {
      const infiniteData = localStorage.getItem(`trendingPosts/${timeframe}`)

      if (!infiniteData) {
        setInitialData(data)
        return
      }

      const parsed: Post[] = JSON.parse(infiniteData) || []
      const savedPosts = parsed?.slice(data.length) || []
      setInitialData([...data, ...savedPosts])

      const position = Number(localStorage.getItem(`${storageKey}/scrollPosition`))
      if (!position) return
      timeout = setTimeout(() => {
        window.scrollTo({
          top: position,
          behavior: 'instant',
        })
      }, 1000)
    } catch (e) {
      console.log('getTrendingError,', e)
      redirect('/')
    } finally {
      localStorage.removeItem(storageKey)
      localStorage.removeItem(`${storageKey}/scrollPosition`)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [data, timeframe])

  return (
    <PostCardGrid
      posts={posts}
      forHome={true}
      forPost={false}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchMore={fetchMore}
    />
  )
}

export default TrendingPosts
