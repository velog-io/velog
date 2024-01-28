import { ENV } from '@/env'
import { getAccessToken } from './auth'

export default async function graphqlFetch<T>({
  url = `${ENV.graphqlHost}/graphql`,
  method = 'POST',
  body,
  headers = {},
  next,
  cache,
  ...init
}: Parameter): Promise<T> {
  let targetUrl = url

  // this block only work in server side
  try {
    const token = await getAccessToken()
    if (token) {
      Object.assign(headers, { authorization: `Bearer ${token.value}` })
    }
  } catch (_) {}

  if (method === 'GET' && body) {
    const queryString = convertToQueryString(body)
    targetUrl = `${url}?${queryString}`
  }

  const res = await fetch(targetUrl, {
    method,
    body: method.toUpperCase() === 'POST' ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    credentials: 'include',
    next,
    cache,
    ...init,
  })

  if (!res.ok) {
    const errors = await res.json()
    const allowOperationList = ['userTags']
    if (!allowOperationList.includes(body?.operationName || '')) {
      console.log('graphqlFetch errors', errors)
      console.log('body', body)
    }
    throw res
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
  variables?: Record<any, any>
}
