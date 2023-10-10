import { ENV } from '@/env'

export default async function fetchGraphql<T>({
  url = `${ENV.graphqlHost}/graphql`,
  method = 'POST',
  body,
  headers,
  next,
  cache,
  ...init
}: Parameter): Promise<T> {
  let finalUrl = url

  const options: RequestInit = {
    method,
    headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
    credentials: 'include',
    next,
    cache,
    ...init,
  }

  if (method === 'GET' && body) {
    const queryString = Object.keys(body)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
      .join('&')
    finalUrl = `${url}?${queryString}`
  } else {
    Object.assign(options, { body: JSON.stringify(body) })
  }

  const res = await fetch(finalUrl, options)

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

type Parameter = {
  url?: string
  body?: Record<string, any>
  headers?: HeadersInit
  init?: Omit<RequestInit, 'body' | 'headers'>
  next?: NextFetchRequestConfig
  cache?: RequestCache
  method?: string
}
