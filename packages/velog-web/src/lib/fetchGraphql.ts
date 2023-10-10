import { ENV } from '@/env'

type Parameter = {
  url?: string
  body?: Record<string, any>
  headers?: HeadersInit
  init?: Omit<RequestInit, 'body' | 'headers'>
  next?: NextFetchRequestConfig
  cache?: RequestCache
  method?: string
}

export default async function fetchGraphql<T>({
  url = `${ENV.graphqlHost}/graphql`,
  body,
  headers,
  next,
  cache,
  method = 'POST',
  ...init
}: Parameter): Promise<T> {
  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
    credentials: 'include',
    next,
    cache,
    ...init,
  })

  if (!res.ok) {
    const errors = await res.json()
    if (errors) {
      console.error(errors[0]?.extensions?.description)
    }
    throw new Error(res.statusText)
  }

  const json = await res.json()

  return json.data as T
}
