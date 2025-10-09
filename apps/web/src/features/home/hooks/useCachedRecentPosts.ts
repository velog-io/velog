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
  const pendingFetchRef = useRef(false)
  const isFetchingRef = useRef(false)

  const fetchMore = useCallback(async () => {
    // If can't fetch yet, mark as pending and return
    if (!canFetchRef.current) {
      pendingFetchRef.current = true
      return
    }

    if (isFetchingRef.current || !hasMoreRef.current) return

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    isFetchingRef.current = true
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
        isFetchingRef.current = false
        setIsFetching(false)
      }
      abortControllerRef.current = null
    }
  }, [limit])

  // Reset state when initialPosts changes
  useEffect(() => {
    // Cancel any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    // Reset state
    setPosts(initialPosts)
    isFetchingRef.current = false
    setIsFetching(false)
    hasMoreRef.current = true
    canFetchRef.current = false
    pendingFetchRef.current = false

    if (initialPosts.length > 0) {
      cursorRef.current = initialPosts[initialPosts.length - 1].id
    } else {
      cursorRef.current = null
    }

    // Allow fetchMore after 1 second
    const timer = setTimeout(() => {
      canFetchRef.current = true

      // If there was a pending fetch request, check scroll position
      if (pendingFetchRef.current && typeof window !== 'undefined') {
        pendingFetchRef.current = false

        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = window.scrollY
        const clientHeight = window.innerHeight

        // If user is still near bottom (within 300px), fetch more
        if (scrollHeight - (scrollTop + clientHeight) < 300) {
          fetchMore()
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [initialPosts, fetchMore])

  return {
    posts,
    isFetching,
    isLoading,
    fetchMore,
  }
}