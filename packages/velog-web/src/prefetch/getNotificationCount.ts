import { IsLoggedDocument, NotificationCountDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getNotificationCount(): Promise<number> {
  try {
    const { isLogged } = await graphqlFetch<{ isLogged: boolean }>({
      body: {
        operationName: 'isLogged',
        query: IsLoggedDocument,
        variables: {},
      },
      next: { revalidate: 0 },
    })

    if (!isLogged) return 0

    const body: GraphqlRequestBody = {
      operationName: 'notificationCount',
      query: NotificationCountDocument,
      variables: {},
    }

    const { notificationCount } = await graphqlFetch<{ notificationCount: number }>({
      body,
      next: { revalidate: 0 },
    })

    return notificationCount
  } catch (error) {
    console.log('getNotificationCount error', error)
    return 0
  }
}
