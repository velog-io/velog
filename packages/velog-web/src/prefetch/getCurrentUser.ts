import { CurrentUserDocument, User } from '@/graphql/helpers/generated'
import { getAccessToken } from '@/lib/auth'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getCurrentUser() {
  const token = getAccessToken()

  if (!token) {
    return null
  }

  try {
    const body: GraphqlRequestBody = {
      operationName: 'currentUser',
      query: CurrentUserDocument,
    }

    const headers = {
      authorization: `Bearer ${token.value}`,
    }

    const { currentUser } = await graphqlFetch<{ currentUser: User }>({
      method: 'GET',
      body,
      next: { revalidate: 0 },
      headers,
    })

    return currentUser
  } catch (error) {
    console.log('get Current user error', error)
    return null
  }
}
