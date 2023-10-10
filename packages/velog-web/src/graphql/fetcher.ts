import { ENV } from '@/env'
import fetchGraphql from '@/lib/fetchGraphql'

export function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const data = await fetchGraphql<TData>({
      url: `${ENV.graphqlHost}/graphql`,
      method: 'POST',
      body: { query, variables },
    })

    return data
  }
}
