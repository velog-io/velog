import { IsLoggedDocument, NotificationCountDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export default async function getNotificationCount(token?: RequestCookie): Promise<number> {
  try {
    const headers = {}
    if (token) {
      Object.assign(headers, { authorization: `Bearer ${token.value}` })
    }

    const { isLogged } = await graphqlFetch<{ isLogged: boolean }>({
      body: {
        operationName: 'isLogged',
        query: IsLoggedDocument,
      },
      next: { revalidate: 0 },
      headers,
    })

    if (!isLogged) return 0

    const body: GraphqlRequestBody = {
      operationName: 'notificationCount',
      query: NotificationCountDocument,
    }
    const { notificationCount } = await graphqlFetch<{ notificationCount: number }>({
      body,
      next: { revalidate: 0 },
      headers,
    })

    return notificationCount
  } catch (error) {
    console.log('getNotificationCount error', error)
    return 0
  }
}
