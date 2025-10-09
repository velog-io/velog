import { cachedApiClient } from '../apiClient'

export interface PostUser {
  id: string
  username: string
  displayName: string
  thumbnail: string | null
}

export interface Post {
  id: string
  title: string
  urlSlug: string
  shortDescription: string | null
  thumbnail: string | null
  releasedAt: string
  updatedAt: string
  user: PostUser
  likes: number
  comments: number
}

export interface PostsResponse {
  posts: Post[]
  cursor: string | null
}

/**
 * Returns a list of approved posts with cursor-based pagination
 * @param cursor - Optional cursor for pagination (Post ID)
 * @returns Object containing posts array and cursor (20 items per page)
 */
export async function getPosts(cursor?: string): Promise<PostsResponse> {
  const response = await cachedApiClient.get<Post[]>('/api/posts', {
    params: cursor ? { cursor } : undefined,
  })
  const posts = response.data
  return {
    posts,
    cursor: posts.length > 0 ? posts[posts.length - 1].id : null,
  }
}

/**
 * Returns a list of curated posts with cursor-based pagination
 * @param cursor - Optional cursor for pagination (Post ID)
 * @returns Object containing posts array and cursor (20 items per page)
 */
export async function getCuratedPosts(cursor?: string): Promise<PostsResponse> {
  const response = await cachedApiClient.get<Post[]>('/api/curated-posts', {
    params: cursor ? { cursor } : undefined,
  })
  const posts = response.data
  return {
    posts,
    cursor: posts.length > 0 ? posts[posts.length - 1].id : null,
  }
}
