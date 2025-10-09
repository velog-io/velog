import { useState, useCallback, useEffect } from 'react'
import { getPosts, getCuratedPosts, type Post, type PostsResponse } from '@/lib/api/cached/posts'

interface UseCachedPostsOptions {
  initialData?: Post[]
  type?: 'recent' | 'curated'
}

export default function useCachedPosts({ initialData = [], type = 'recent' }: UseCachedPostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>(initialData)
  const [cursor, setCursor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Set initial cursor from initial data
  useEffect(() => {
    if (initialData.length > 0) {
      setCursor(initialData[initialData.length - 1].id)
    }
  }, [initialData])

  const fetchMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const fetchFunction = type === 'curated' ? getCuratedPosts : getPosts
      const response: PostsResponse = await fetchFunction(cursor || undefined)

      if (response.posts.length === 0) {
        setHasMore(false)
      } else {
        setPosts((prev) => [...prev, ...response.posts])
        setCursor(response.cursor)
        // If we got less than 20 posts, we've reached the end
        if (response.posts.length < 20) {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error('Failed to fetch more posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [cursor, hasMore, isLoading, type])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const fetchFunction = type === 'curated' ? getCuratedPosts : getPosts
      const response: PostsResponse = await fetchFunction()

      setPosts(response.posts)
      setCursor(response.cursor)
      setHasMore(response.posts.length === 20)
    } catch (error) {
      console.error('Failed to refresh posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [type])

  return {
    posts,
    isLoading,
    hasMore,
    fetchMore,
    refresh,
  }
}