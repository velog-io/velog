import { CurrentUserDocument, User } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export default async function getCurrentUser(accessToken?: RequestCookie) {
  if (!accessToken) {
    return null
  }

  try {
    const body: GraphqlRequestBody = {
      operationName: 'currentUser',
      query: CurrentUserDocument,
    }

    const headers = {}
    if (accessToken) {
      Object.assign(headers, {
        authorization: `Bearer ${accessToken.value}`,
      })
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
