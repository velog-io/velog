import { getCuratedPosts } from '@/lib/api/cached/posts'

interface GetCuratedPostsOptions {
  cursor?: string
  limit?: number
}

export default async function getCuratedPostsPrefetch({ cursor, limit = 50 }: GetCuratedPostsOptions = {}) {
  try {
    const response = await getCuratedPosts(cursor)

    // Apply limit if specified
    if (limit && response.posts.length > limit) {
      return {
        posts: response.posts.slice(0, limit),
        cursor: response.posts[limit - 1]?.id || response.cursor,
      }
    }

    return response
  } catch (error) {
    console.log('getCuratedPosts error:', error)
    return { posts: [], cursor: null }
  }
}