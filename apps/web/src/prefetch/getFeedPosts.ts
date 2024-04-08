import { ENV } from '@/env'
import { FeedPostsDocument, Post } from '@/graphql/server/generated/server'
import { getAccessToken } from '@/lib/auth'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getFeedPosts({ limit = ENV.defaultPostLimit }: Args) {
  const headers = {}
  const token = getAccessToken()
  if (token) {
    Object.assign(headers, { authorization: `Bearer ${token.value}` })
  }

  const body: GraphqlRequestBody = {
    operationName: 'feedPosts',
    query: FeedPostsDocument,
    variables: {
      input: {
        limit,
      },
    },
  }

  try {
    const { feedPosts } = await graphqlFetch<{ feedPosts: Post[] }>({
      method: 'GET',
      body,
      next: { revalidate: 0 },
      headers,
    })

    return feedPosts
  } catch (error) {
    console.log('getFeedPosts error: ', error)
    return []
  }
}

type Args = {
  limit: number
}
