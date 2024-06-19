import { ENV } from '@/env'
import graphqlFetch from '@/lib/graphqlFetch'

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
