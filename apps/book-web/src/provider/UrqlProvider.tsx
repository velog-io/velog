import { createClient, subscriptionExchange, cacheExchange, fetchExchange, Provider } from 'urql'
import { createClient as createWSClient, SubscribePayload } from 'graphql-ws'
import { ENV } from '@/env'

type Props = {
  children: React.ReactNode
}

const wsClient = createWSClient({
  url: `ws://${ENV.graphqlBookServerHost.replace(/^http(s)?:\/\//, '')}/graphql`,
})

export const urqlClient = createClient({
  url: `${ENV.graphqlBookServerHost}/graphql`,
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation as SubscribePayload, sink),
        }),
      }),
    }),
  ],
})

function UrqlProvider({ children }: Props) {
  return <Provider value={urqlClient}>{children}</Provider>
}

export default UrqlProvider