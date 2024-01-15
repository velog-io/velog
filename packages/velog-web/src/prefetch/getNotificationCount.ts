import { IsLoggedDocument, NotificationCountDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getNotificationCount(): Promise<number> {
  try {
    const result = await graphqlFetch({
      body: {
        operationName: 'isLogged',
        query: IsLoggedDocument,
      },
    })

    console.log('result', result)

    const body: GraphqlRequestBody = {
      operationName: 'notificationCount',
      query: NotificationCountDocument,
    }
    const { notificationCount } = await graphqlFetch<{ notificationCount: number }>({
      body,
    })

    return notificationCount
  } catch (error) {
    console.log('getNotificationCount error', error)
    return 0
  }
}
