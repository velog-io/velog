import { ENV } from '@/env'

type Parameter = {
  url?: string
  body?: Record<string, any>
  headers?: HeadersInit
  init?: Omit<RequestInit, 'body' | 'headers'>
  next?: NextFetchRequestConfig
}

export default async function postData({
  url = `${ENV.graphqlHost}/graphql`,
  body,
  headers,
  next,
  ...init
}: Parameter) {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
    credentials: 'include',
    next,
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

  return json.data
}
