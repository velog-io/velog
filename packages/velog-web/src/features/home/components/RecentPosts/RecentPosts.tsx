'use client'

import PostCardGrid from '@/features/home/components/PostCardGrid/PostCardGrid'
import useRecentPosts from '@/features/home/hooks/useRecentPosts'
import { useEffect, useRef, useState } from 'react'
import { Post } from '@/graphql/helpers/generated'

type Props = {
  data: any[]
}

function RecentPosts({ data }: Props) {
  const hasEffectRun = useRef<boolean>(false)

  const [initialData, setInitialData] = useState<Post[]>([])
  const { posts, isFetching, fetchMore, isLoading } = useRecentPosts(initialData as Post[])

  useEffect(() => {
    if (hasEffectRun.current) return
    hasEffectRun.current = true

    const storageKey = 'recentPosts'
    let timeout: NodeJS.Timeout
    try {
      const infiniteData = localStorage.getItem(storageKey)

      if (!infiniteData) {
        setInitialData(data as any)
        return
      }

      const parsed: Post[] = JSON.parse(infiniteData) || []
      const savedPosts = parsed?.slice(data.length) || []
      setInitialData([...data, ...savedPosts] as Post[])

      const position = Number(localStorage.getItem(`${storageKey}/scrollPosition`))
      if (!position) return
      timeout = setTimeout(() => {
        window.scrollTo({
          top: position,
          behavior: 'instant',
        })
      }, 1000)
    } catch (error) {
      console.log('getRecentPosts from storage error', error)
    } finally {
      localStorage.removeItem(storageKey)
      localStorage.removeItem(`${storageKey}/scrollPosition`)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [data])

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

export default RecentPosts
