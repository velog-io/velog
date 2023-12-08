import { CurrentUserDocument, User } from '@/graphql/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export default async function getCurrentUser(accessToken: RequestCookie | undefined) {
  if (!accessToken) {
    return null
  }

  try {
    const body: GraphqlRequestBody = {
      operationName: 'currentUser',
      query: CurrentUserDocument,
    }

    const { currentUser } = await graphqlFetch<{ currentUser: User }>({
      method: 'POST',
      body,
      cache: 'no-cache',
      headers: {
        authorization: `Bearer ${accessToken.value}`,
      },
    })

    return currentUser
  } catch (error) {
    console.log('get Current user error', error)
    return null
  }
}
