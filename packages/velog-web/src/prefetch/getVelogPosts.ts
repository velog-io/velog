import { Post, VelogPostsDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getVelogPosts({ username, tag }: GetVelogPostsArgs) {
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
      next: { revalidate: 0 },
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
