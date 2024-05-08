import { ENV } from '@/env.mjs'
import graphqlFetch from '@/lib/graphqlFetch'

export function fetcher<TData, TVariables extends Record<string, any>>(
  query: string,
  variables?: TVariables,
  headers?: RequestInit['headers'],
) {
  return async (): Promise<TData> => {
    const data = await graphqlFetch<TData>({
      url: `${ENV.bookApiHost}/graphql`,
      method: 'POST',
      body: { query, variables: variables ?? {} },
      headers: {
        ...headers,
      },
    })

    return data
  }
}
