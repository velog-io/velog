import { GetUserDocument, User } from '@/graphql/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getUser(username: string) {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'getUser',
      query: GetUserDocument,
      variables: {
        input: {
          username,
        },
      },
    }

    const { user } = await graphqlFetch<{ user: User }>({
      body,
      next: { revalidate: 0 },
    })

    if (!user) {
      return null
    }

    return { ...user, profile: user.profile! }
  } catch (error) {
    console.log('getUesrProfile error', error)
    return null
  }
}
