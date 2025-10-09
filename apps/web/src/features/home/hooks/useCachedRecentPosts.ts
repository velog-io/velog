import { useState, useCallback, useEffect, useRef } from 'react'
import { getPosts, type Post } from '@/lib/api/cached/posts'
import { ENV } from '@/env'

export default function useCachedRecentPosts(initialPosts: Post[] = [], limit = ENV.defaultPostLimit) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const cursorRef = useRef<string | null>(null)
  const hasMoreRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)
  const canFetchRef = useRef(false)

  // Reset state when initialPosts changes
  useEffect(() => {
    // Cancel any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    // Reset state
    setPosts(initialPosts)
    setIsFetching(false)
    hasMoreRef.current = true
    canFetchRef.current = false

    if (initialPosts.length > 0) {
      cursorRef.current = initialPosts[initialPosts.length - 1].id
    } else {
      cursorRef.current = null
    }

    // Allow fetchMore after 1 second
    const timer = setTimeout(() => {
      canFetchRef.current = true
    }, 1000)

    return () => clearTimeout(timer)
  }, [initialPosts])

  const fetchMore = useCallback(async () => {
    if (!canFetchRef.current || isFetching || !hasMoreRef.current) return

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setIsFetching(true)
    try {
      const response = await getPosts(cursorRef.current || undefined)

      // Check if this request was aborted
      if (abortController.signal.aborted) {
        return
      }

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
      if (!abortController.signal.aborted) {
        console.error('Failed to fetch more posts:', error)
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsFetching(false)
      }
      abortControllerRef.current = null
    }
  }, [limit])

  return {
    posts,
    isFetching,
    isLoading,
    fetchMore,
  }
}