import { ENV } from '@/env'
import { Post, RecentPostsDocument, RecentPostsInput } from '@/graphql/generated'
import fetchGraphql from '@/lib/fetchGraphql'

export default async function getRecentPost({ limit = ENV.defaultPostLimit }: RecentPostsInput) {
  try {
    const body = {
      operationName: 'recentPosts',
      query: RecentPostsDocument,
      variables: {
        input: {
          limit,
        },
      },
    }

    const { recentPosts } = await fetchGraphql<{ recentPosts: Post[] }>({
      body,
      cache: 'no-cache',
    })

    return recentPosts
  } catch (error) {
    console.log('getRecentPosts error', error)
    return []
  }
}
