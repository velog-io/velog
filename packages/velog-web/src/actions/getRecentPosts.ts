import { ENV } from '@/env'
import { Post, RecentPostsDocument, RecentPostsInput } from '@/graphql/generated'
import graphqlFetch from '@/lib/graphqlFetch'

export default async function getRecentPosts({ limit = ENV.defaultPostLimit }: RecentPostsInput) {
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

    const { recentPosts } = await graphqlFetch<{ recentPosts: Post[] }>({
      method: 'GET',
      body,
      cache: 'no-cache',
    })

    return recentPosts
  } catch (error) {
    return []
  }
}
