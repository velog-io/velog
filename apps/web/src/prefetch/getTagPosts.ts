import { Post, VelogPostsDocument } from '@/graphql/server/generated/server'
import { getAccessToken } from '@/lib/auth'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getTagPosts(tag: string, limit = 20): Promise<Post[]> {
  try {
    const headers = {}
    const token = await getAccessToken()
    if (token) {
      Object.assign(headers, { authorization: `Bearer ${token.value}` })
    }

    const body: GraphqlRequestBody = {
      operationName: 'velogPosts',
      query: VelogPostsDocument,
      variables: {
        input: {
          tag,
          limit,
        },
      },
    }

    const { posts } = await graphqlFetch<{ posts: Post[] }>({
      method: 'GET',
      body,
      next: { revalidate: 60 },
      headers,
    })

    return posts
  } catch (error) {
    console.log('getTagPosts error', error)
    return []
  }
}
