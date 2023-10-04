import { ReadPostInput, ReadPostDocument, Post } from '@/graphql/generated'
import postData from '@/lib/postData'

export default async function getPostByUrlSlug({ username, url_slug }: ReadPostInput) {
  try {
    const body = {
      operationName: 'readPost',
      query: ReadPostDocument,
      variables: {
        input: {
          username,
          url_slug,
        },
      },
    }

    const { post } = await postData({
      body,
    })

    return post as Post
  } catch (error) {
    console.log('readPost error', error)
    return null
  }
}
