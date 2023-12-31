import { UserTags, UserTagsDocument } from '@/graphql/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getUserTags(username: string) {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'userTags',
      query: UserTagsDocument,
      variables: {
        input: {
          username,
        },
      },
    }

    const { userTags } = await graphqlFetch<{ userTags: UserTags }>({
      body,
      next: { revalidate: 20 },
    })

    return userTags
  } catch (error) {
    console.log(error)
    throw new Error('Get user tags error')
  }
}
