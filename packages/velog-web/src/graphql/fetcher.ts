import { ENV } from '@/env'
import fetchGraphql from '@/lib/graphqlFetcher'

export function fetcher<TData, TVariables extends Record<string, any>>(
  query: string,
  variables?: TVariables,
) {
  return async (): Promise<TData> => {
    const data = await fetchGraphql<TData>({
      url: `${ENV.graphqlHost}/graphql`,
      method: 'POST',
      body: { query, variables },
    })

    return data
  }
}
