'use client'

import PostCardGrid from '@/features/home/components/PostCardGrid/PostCardGrid'
import useCachedRecentPosts from '@/features/home/hooks/useCachedRecentPosts'
import { useMemo, useEffect, useState, useRef } from 'react'
import { PostsResponse, Post as CachedPost } from '@/lib/api/cached/posts'

type Props = {
  data: PostsResponse
}

// Transform cached API post to GraphQL Post format for PostCardGrid compatibility
function transformCachedPost(cachedPost: CachedPost): any {
  return {
    id: cachedPost.id,
    title: cachedPost.title,
    url_slug: cachedPost.urlSlug,
    short_description: cachedPost.shortDescription,
    thumbnail: cachedPost.thumbnail,
    released_at: cachedPost.releasedAt,
    updated_at: cachedPost.updatedAt,
    user: {
      id: cachedPost.user.id,
      username: cachedPost.user.username,
      profile: {
        id: cachedPost.user.id,
        display_name: cachedPost.user.displayName,
        thumbnail: cachedPost.user.thumbnail,
        short_bio: null,
        profile_links: null,
      },
    },
    likes: cachedPost.likes,
    comments_count: cachedPost.comments,
    // Fields that are not provided by cached API but required by GraphQL Post type
    body: null,
    comments: [],
    created_at: cachedPost.releasedAt,
    fk_user_id: cachedPost.user.id,
    is_followed: null,
    is_liked: null,
    is_markdown: null,
    is_private: false,
    is_temp: null,
    last_read_at: null,
    linked_posts: null,
    meta: null,
    original_post_id: null,
    post_histories: [],
    recommended_posts: [],
    series: null,
    tags: [],
    views: 0,
  }
}

function CachedRecentPosts({ data }: Props) {
  const [initialPosts, setInitialPosts] = useState<CachedPost[]>(data.posts)
  const hasRestoredRef = useRef(false)
  const { posts, isFetching, fetchMore, isLoading } = useCachedRecentPosts(initialPosts)

  // Save posts and scroll position when post is clicked
  const handlePostClick = () => {
    if (typeof window === 'undefined') return
    if (posts.length > 0) {
      try {
        sessionStorage.setItem('recentPosts', JSON.stringify(posts))
        sessionStorage.setItem('recentPostsScroll', window.scrollY.toString())
      } catch (error) {
        // Ignore sessionStorage errors
      }
    }
  }

  // Restore posts and scroll position on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (hasRestoredRef.current) return
    hasRestoredRef.current = true

    try {
      const savedPosts = sessionStorage.getItem('recentPosts')
      const savedScroll = sessionStorage.getItem('recentPostsScroll')

      if (savedPosts) {
        const parsed: CachedPost[] = JSON.parse(savedPosts)
        if (parsed.length > data.posts.length) {
          setInitialPosts(parsed)
        }

        if (savedScroll) {
          const scrollPosition = Number(savedScroll)
          if (scrollPosition > 0) {
            // Restore scroll immediately
            window.scrollTo({
              top: scrollPosition,
              behavior: 'instant',
            })
          }
        }

        // Clear after restoring
        sessionStorage.removeItem('recentPosts')
        sessionStorage.removeItem('recentPostsScroll')
      }
    } catch (error) {
      console.error('Failed to restore recent posts:', error)
    }
  }, [data.posts])

  // Transform cached posts to GraphQL format
  const transformedPosts = useMemo(() => {
    return posts.map(transformCachedPost)
  }, [posts])

  return (
    <PostCardGrid
      posts={transformedPosts}
      forHome={true}
      forPost={false}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchMore={fetchMore}
      onPostCardClick={handlePostClick}
    />
  )
}

export default CachedRecentPosts