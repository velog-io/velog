'use client'

import PostCardGrid from '@/features/home/components/PostCardGrid/PostCardGrid'
import useCachedCuratedPosts from '@/features/home/hooks/useCachedCuratedPosts'
import { useEffect, useRef, useState, useMemo } from 'react'
import { PostsResponse, Post as CachedPost } from '@/lib/api/cached/posts'
import { Post as GraphQLPost } from '@/graphql/server/generated/server'

type Props = {
  data: PostsResponse
}

// Transform cached API post to GraphQL Post format for PostCardGrid compatibility
function transformCachedPost(cachedPost: CachedPost): GraphQLPost {
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
  } as GraphQLPost
}

function CuratedPosts({ data }: Props) {
  const hasEffectRun = useRef<boolean>(false)

  const [initialData, setInitialData] = useState<CachedPost[]>([])
  const { posts, isFetching, fetchMore, isLoading } = useCachedCuratedPosts(initialData)

  // Transform cached posts to GraphQL format
  const transformedPosts = useMemo(() => {
    return posts.map(transformCachedPost)
  }, [posts])

  useEffect(() => {
    if (hasEffectRun.current) return
    hasEffectRun.current = true

    const storageKey = 'curatedPosts'
    let timeout: NodeJS.Timeout
    try {
      const infiniteData = localStorage.getItem(storageKey)

      if (!infiniteData) {
        setInitialData(data.posts)
        return
      }

      const parsed: CachedPost[] = JSON.parse(infiniteData) || []
      const savedPosts = parsed?.slice(data.posts.length) || []
      setInitialData([...data.posts, ...savedPosts])

      const position = Number(localStorage.getItem(`${storageKey}/scrollPosition`))
      if (!position) return
      timeout = setTimeout(() => {
        window.scrollTo({
          top: position,
          behavior: 'instant',
        })
      }, 1000)
    } catch (error) {
      console.log('getCuratedPosts from storage error', error)
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
      posts={transformedPosts}
      forHome={true}
      forPost={false}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchMore={fetchMore}
    />
  )
}

export default CuratedPosts