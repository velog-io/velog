type Parameter = {
  url: string
  body?: Record<string, any>
  headers?: HeadersInit
  init?: Omit<RequestInit, 'body' | 'headers'>
}

export default async function postData({
  url,
  body,
  headers,
  ...init
}: Parameter) {
  console.log('url', url)
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
    credentials: 'include',
    ...init,
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  return res.json()
}
