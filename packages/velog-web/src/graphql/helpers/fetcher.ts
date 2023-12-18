import { ENV } from '@/env'
import graphqlFetch from '@/lib/graphqlFetch'

export function fetcher<TData, TVariables extends Record<string, any>>(
  query: string,
  variables?: TVariables,
) {
  return async (): Promise<TData> => {
    const data = await graphqlFetch<TData>({
      url: `${ENV.graphqlHost}/graphql`,
      method: 'POST',
      body: { query, variables: variables ?? {} },
    })

    return data
  }
}
