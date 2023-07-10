type Parameter = {
  url?: string
  body?: Record<string, any>
  headers?: HeadersInit
  init?: Omit<RequestInit, 'body' | 'headers'>
}

export default async function postData({
  url = `${process.env.NEXT_PUBLIC_GRAPHQL_HOST}/graphql`,
  body,
  headers,
  ...init
}: Parameter) {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
    credentials: 'include',
    ...init,
  })

  if (!res.ok) {
    const errors = await res.json()
    if (errors) {
      console.error(errors[0]?.extensions?.description)
    }

    throw new Error(res.statusText)
  }

  return res.json()
}
