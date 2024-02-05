import { ENV } from '@/env'
import { FeedPostsDocument, Post } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getFeedPosts({ limit = ENV.defaultPostLimit }: Args) {
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
