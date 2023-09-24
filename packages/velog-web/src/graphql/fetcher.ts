import { ENV } from '@/env'

export function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(`${ENV.graphqlHost}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    const json = await res.json()

    if (!res.ok) {
      const errors = await res.json()
      if (errors) {
        console.error(errors[0]?.extensions?.description)
      }
      throw new Error(res.statusText)
    }

    return json.data
  }
}
