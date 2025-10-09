import { useState, useCallback, useEffect, useRef } from 'react'
import { getCuratedPosts, type Post } from '@/lib/api/cached/posts'
import { ENV } from '@/env'

export default function useCachedCuratedPosts(initialPosts: Post[] = [], limit = ENV.defaultPostLimit) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const cursorRef = useRef<string | null>(null)
  const hasMoreRef = useRef(true)

  // Set initial cursor from initial posts
  useEffect(() => {
    if (initialPosts.length > 0) {
      cursorRef.current = initialPosts[initialPosts.length - 1].id
      setPosts(initialPosts)
    }
  }, [initialPosts])

  const fetchMore = useCallback(async () => {
    if (isFetching || !hasMoreRef.current) return

    setIsFetching(true)
    try {
      const response = await getCuratedPosts(cursorRef.current || undefined)

      if (response.posts.length === 0) {
        hasMoreRef.current = false
      } else {
        setPosts((prev) => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(p => p.id))
          const newPosts = response.posts.filter(p => !existingIds.has(p.id))
          return [...prev, ...newPosts]
        })
        cursorRef.current = response.cursor
        // If we got less than the default limit, we've reached the end
        if (response.posts.length < limit) {
          hasMoreRef.current = false
        }
      }
    } catch (error) {
      console.error('Failed to fetch more curated posts:', error)
    } finally {
      setIsFetching(false)
    }
  }, [isFetching, limit])

  return {
    posts,
    isFetching,
    isLoading,
    fetchMore,
  }
}