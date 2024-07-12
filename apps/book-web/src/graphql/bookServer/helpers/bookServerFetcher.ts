import { ENV } from '@/env'
import graphqlFetch from '@/lib/graphqlFetch'
import { pipe, subscribe } from 'wonka'
import { urqlClient } from './bookServerUrlql'
import { AnyVariables } from 'urql'

export function fetcher<TData, TVariables extends Record<string, any>>(
  query: string,
  variables?: TVariables,
  headers?: RequestInit['headers'],
) {
  return async (): Promise<Awaited<TData>> => {
    const data = await graphqlFetch<TData>({
      url: `${ENV.graphqlBookServerHost}/graphql`,
      method: 'POST',
      body: { query, variables: variables ?? {} },
      headers: {
        ...headers,
      },
    })

    return data as Awaited<TData>
  }
}
export function subscriptionFetcher<TData, TVariables extends AnyVariables>(
  query: string,
  variables: TVariables,
) {
  return new Promise<TData>((resolve) => {
    const subscription = pipe(
      urqlClient.subscription<TData, TVariables>(query, variables),
      subscribe((result) => {
        if (result.data) {
          resolve(result.data)
        }
      }),
    )

    return () => subscription.unsubscribe()
  })
}
