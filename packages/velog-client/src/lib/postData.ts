type Parameter = {
  url: string
  body: Record<string, any>
  headers: HeadersInit
  init?: Omit<RequestInit, 'body' | 'headers'>
}

export default async function postData({
  url,
  body,
  headers,
  ...init
}: Parameter) {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...init,
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  return await res.json()
}
