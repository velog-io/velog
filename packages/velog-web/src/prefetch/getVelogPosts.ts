import { Post, VelogPostsDocument } from '@/graphql/helpers/generated'
import { getAccessToken } from '@/lib/auth'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getVelogPosts({ username, tag }: GetVelogPostsArgs) {
  try {
    const headers = {}
    const token = getAccessToken()
    if (token) {
      Object.assign(headers, { authorization: `Bearer ${token.value}` })
    }

    const body: GraphqlRequestBody = {
      operationName: 'velogPosts',
      query: VelogPostsDocument,
      variables: {
        input: {
          username,
          tag,
          limit: 5,
        },
      },
    }

    const { posts } = await graphqlFetch<{ posts: Post[] }>({
      method: 'GET',
      body,
      next: { revalidate: 1 },
      headers,
    })

    return posts
  } catch (error) {
    console.log('getVelogPosts error', error)
    return []
  }
}

type GetVelogPostsArgs = {
  username: string
  tag?: string
}
