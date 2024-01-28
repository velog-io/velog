import { CurrentUserDocument, User } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getCurrentUser() {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'currentUser',
      query: CurrentUserDocument,
    }

    const { currentUser } = await graphqlFetch<{ currentUser: User }>({
      method: 'GET',
      body,
      next: { revalidate: 0 },
    })

    return currentUser
  } catch (error) {
    console.log('get Current user error', error)
    return null
  }
}
