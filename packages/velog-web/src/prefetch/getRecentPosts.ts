import { ENV } from '@/env'
import { Post, RecentPostsDocument, RecentPostsInput } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getRecentPosts({ limit = ENV.defaultPostLimit }: RecentPostsInput) {
  try {
    const body: GraphqlRequestBody = {
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
      next: { revalidate: 0 },
    })

    return recentPosts
  } catch (error) {
    console.log('getRecentPosts error:', error)
    return []
  }
}
