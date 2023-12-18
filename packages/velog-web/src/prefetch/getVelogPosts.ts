import { GetPostsInput, Post, VelogPostsDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getVelogPosts({ username, tag }: GetPostsInput) {
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

    const { posts } = await graphqlFetch<{ posts: Post[] }>({
      body,
      next: { revalidate: 100 },
    })

    return posts
  } catch (error) {
    console.log('getVelogPosts error', error)
    return []
  }
}
