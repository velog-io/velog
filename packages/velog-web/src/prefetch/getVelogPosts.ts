import { Post, VelogPostsDocument } from '@/graphql/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getVelogPosts({ username, tag, accessToken }: GetVelogPostsArgs) {
  try {
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

    const headers = {}
    if (accessToken) {
      Object.assign(headers, { authorization: `Bearer ${accessToken}` })
    }

    const { posts } = await graphqlFetch<{ posts: Post[] }>({
      body,
      cache: 'no-cache',
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
  accessToken?: string
}
