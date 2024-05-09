import { GetPagesDocument, GetPagesQuery } from '@/graphql/bookServer/generated/bookServer'
import graphqlFetch, { type GraphqlRequestBody } from '@/lib/graphqlFetch'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

export default async function getPages(bookUrlSlug: string, cookies: NextApiRequestCookies) {
  try {
    const headers = {}
    const token = cookies.access_token

    if (token) {
      Object.assign(headers, { authorization: `Bearer ${token}` })
    }

    const body: GraphqlRequestBody = {
      operationName: 'getPages',
      query: GetPagesDocument,
      variables: {
        input: {
          book_url_slug: bookUrlSlug,
        },
      },
    }

    const { pages } = await graphqlFetch<GetPagesQuery>({
      method: 'GET',
      body,
      headers,
    })

    return pages
  } catch (_) {
    return null
  }
}
