import {
  GetPageDocument,
  type GetPageQuery,
  type GetPageQueryVariables,
} from '@/graphql/bookServer/generated/bookServer'
import type { GraphqlRequestBody } from '@/lib/graphqlFetch'
import type { NextApiRequestCookies } from 'next/dist/server/api-utils'
import graphqlFetch from '@/lib/graphqlFetch'

export default async function getPage(
  bookUrlSlug: string,
  pageUrlSlug: string,
  cookies: NextApiRequestCookies,
) {
  try {
    const headers = {}
    const token = cookies.access_token

    if (token) {
      Object.assign(headers, { authorization: `Bearer ${token}` })
    }

    const body: GraphqlRequestBody<GetPageQueryVariables> = {
      operationName: 'getPage',
      query: GetPageDocument,
      variables: {
        input: {
          book_url_slug: bookUrlSlug,
          page_url_slug: pageUrlSlug,
        },
      },
    }

    const data = await graphqlFetch<GetPageQuery>({
      method: 'GET',
      body,
      headers,
    })

    return data?.page
  } catch (error) {
    console.error('Get page error:', error)
    return null
  }
}
