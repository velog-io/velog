import { createClient, subscriptionExchange, cacheExchange, fetchExchange, Provider } from 'urql'
import { createClient as createWSClient } from 'graphql-ws'
import { ENV } from '@/env'

type Props = {
  children: React.ReactNode
}

const wsClient = createWSClient({
  url: `ws://${ENV.graphqlBookServerHost.replace(/^http(s)?:\/\//, '')}/graphql`,
})

const urqlClient = createClient({
  url: `${ENV.graphqlBookServerHost}/graphql`,
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (request) => ({
        subscribe: (sink) => {
          const input = { ...request, query: request.query || '' }
          return {
            unsubscribe: wsClient.subscribe(input, sink),
          }
        },
      }),
    }),
  ],
})

function UrqlProvider({ children }: Props) {
  return <Provider value={urqlClient}>{children}</Provider>
}

export default UrqlProvider
