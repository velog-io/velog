import { ENV } from '@/env'

export default async function graphqlFetch<T>({
  url = `${ENV.graphqlBookServerHost}/graphql`,
  method = 'POST',
  body,
  headers = {},
  next,
  cache,
  ...init
}: Parameter): Promise<T> {
  let targetUrl = url

  if (method === 'GET' && body) {
    const queryString = convertToQueryString(body)
    targetUrl = `${url}?${queryString}`
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const combinedHeaders = new Headers({
    ...defaultHeaders,
    ...headers,
  })

  const res = await fetch(targetUrl, {
    method,
    body: method.toUpperCase() === 'POST' ? JSON.stringify(body) : undefined,
    headers: combinedHeaders,
    credentials: 'include',
    next,
    cache,
    ...init,
  })

  if (!res.ok) {
    const errors = await res.json()
    const allowOperationNameList = ['userTags', 'velogConfig']
    const allowStatusCode = [404]
    if (
      !allowOperationNameList.includes(body?.operationName || '') &&
      allowStatusCode.includes(res.status)
    ) {
      console.log('graphqlFetch errors', errors)
      console.log('body', body)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('fetch failed res:', res)
    }

    const message = {
      operationName: body?.operationName,
      status: res.status,
      statusText: res.statusText,
    }

    throw new Error(message as any)
  }

  const json = await res.json()

  return json.data as T
}

function convertToQueryString(body: GraphqlRequestBody): string {
  if (!body.query) {
    throw new Error('The query field is required!')
  }
  const query = encodeURIComponent(body.query)

  const operationPart = body.operationName
    ? `operationName=${encodeURIComponent(body.operationName)}&`
    : ''

  // variables가 제공되지 않으면 빈 문자열을 반환
  const variablesPart = body?.variables
    ? `&variables=${encodeURIComponent(JSON.stringify(body.variables))}`
    : ''

  return `${operationPart}query=${query}${variablesPart}`
}

type Parameter = {
  url?: string
  body?: GraphqlRequestBody
  headers?: HeadersInit
  init?: Omit<RequestInit, 'body' | 'headers'>
  next?: NextFetchRequestConfig
  cache?: RequestCache
  method?: 'GET' | 'POST'
}

export type GraphqlRequestBody = {
  operationName?: string
  query: string
  variables: Record<any, any>
}
