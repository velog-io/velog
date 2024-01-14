import { NotificationCountDocument } from '@/graphql/helpers/generated'
import { isLogged } from '@/lib/auth'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getNotificationCount(): Promise<number> {
  const isLogin = isLogged()

  if (!isLogin) {
    return 0
  }

  try {
    const body: GraphqlRequestBody = {
      operationName: 'notificationCount',
      query: NotificationCountDocument,
    }
    const { count } = await graphqlFetch<{ count: number }>({ body })

    return count
    return 0
  } catch (error) {
    console.log('getNotificationCount error', error)
    return 0
  }
}
