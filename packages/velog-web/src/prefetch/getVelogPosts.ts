import { Post, VelogPostsDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

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
      Object.assign(headers, {
        authorization: `Bearer ${accessToken.value}`,
      })
    }

    const { posts } = await graphqlFetch<{ posts: Post[] }>({
      body,
      next: { revalidate: 0 },
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
  accessToken?: RequestCookie
}
