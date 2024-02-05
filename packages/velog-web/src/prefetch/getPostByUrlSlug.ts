import { ReadPostInput, ReadPostDocument, Post } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getPostByUrlSlug({ username, url_slug }: ReadPostInput) {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'readPost',
      query: ReadPostDocument,
      variables: {
        input: {
          username,
          url_slug,
        },
      },
    }

    const { post } = await graphqlFetch<{ post: Post }>({
      body,
    })

    return post
  } catch (error) {
    console.log('readPost error', error)
    return null
  }
}
