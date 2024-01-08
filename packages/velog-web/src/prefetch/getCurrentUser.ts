import { CurrentUserDocument, User } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export default async function getCurrentUser({ accessToken }: GetCurrentUserArgs) {
  if (!accessToken) {
    return null
  }

  try {
    const body: GraphqlRequestBody = {
      operationName: 'currentUser',
      query: CurrentUserDocument,
    }

    if (!accessToken) return null

    const headers = {
      authorization: `Bearer ${accessToken.value}`,
    }

    const { currentUser } = await graphqlFetch<{ currentUser: User }>({
      method: 'GET',
      body,
      next: { revalidate: 60 * 10 },
      headers,
    })

    return currentUser
  } catch (error) {
    console.log('get Current user error', error)
    return null
  }
}

type GetCurrentUserArgs = {
  accessToken: RequestCookie
}
