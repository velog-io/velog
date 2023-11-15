import { GetUserProfileDocument, User } from '@/graphql/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getUserProfile(username: string) {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'getUserProfile',
      query: GetUserProfileDocument,
      variables: {
        input: {
          username,
        },
      },
    }

    const { user } = await graphqlFetch<{ user: User }>({
      body,
      next: { revalidate: 10 },
    })

    if (!user) {
      return null
    }

    return user.profile
  } catch (error) {
    console.log('getUesrProfile error', error)
    return null
  }
}
