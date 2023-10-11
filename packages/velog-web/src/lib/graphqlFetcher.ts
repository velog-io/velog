import { ENV } from '@/env'

export default async function graphqlFetcher<T>({
  url = `${ENV.graphqlHost}/graphql`,
  method = 'POST',
  body,
  headers,
  next,
  cache,
  ...init
}: Parameter): Promise<T> {
  let finalUrl = url

  if (method === 'GET' && body) {
    const queryString = convertToQueryString(body)
    finalUrl = `${url}?${queryString}`
  }

  const res = await fetch(finalUrl, {
    method,
    body: method.toUpperCase() === 'POST' ? JSON.stringify(body) : undefined,
    headers: new Headers({ 'Content-Type': 'application/json', ...headers }),
    credentials: 'include',
    next,
    cache,
    ...init,
  })

  if (!res.ok) {
    const errors = await res.json()
    console.error(errors[0]?.extensions?.description || 'Error fetching GraphQL data.')
    throw new Error(res.statusText)
  }

  const json = await res.json()

  return json.data as T
}

function convertToQueryString(body: GraphQLRequestBody): string {
  if (!body.query) {
    throw new Error('The query field is required!')
  }
  const query = encodeURIComponent(body.query)

  const operationPart = body.operationName
    ? `operationName=${encodeURIComponent(body.operationName)}&`
    : ''

  // variables가 제공되지 않으면 빈 문자열을 반환
  const variablesPart = body.variables
    ? `&variables=${encodeURIComponent(JSON.stringify(body.variables))}`
    : ''

  return `${operationPart}query=${query}${variablesPart}`
}

type Parameter = {
  url?: string
  body?: GraphQLRequestBody
  headers?: HeadersInit
  init?: Omit<RequestInit, 'body' | 'headers'>
  next?: NextFetchRequestConfig
  cache?: RequestCache
  method?: 'GET' | 'POST'
}

export type GraphQLRequestBody = {
  operationName?: string
  query: string
  variables?: Record<any, any>
}
