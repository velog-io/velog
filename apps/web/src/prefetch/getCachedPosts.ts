import { getPosts } from '@/lib/api/cached/posts'

interface GetCachedPostsOptions {
  cursor?: string
  limit?: number
}

export default async function getCachedPosts({ cursor, limit = 50 }: GetCachedPostsOptions = {}) {
  try {
    const response = await getPosts(cursor)

    // Apply limit if specified
    if (limit && response.posts.length > limit) {
      return {
        posts: response.posts.slice(0, limit),
        cursor: response.posts[limit - 1]?.id || response.cursor,
      }
    }

    return response
  } catch (error) {
    console.log('getCachedPosts error:', error)
    return { posts: [], cursor: null }
  }
}