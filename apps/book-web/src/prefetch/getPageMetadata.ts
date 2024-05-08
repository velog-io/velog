import {
  GetPageMetadataDocument,
  GetPageMetadataQuery,
} from '@/graphql/bookServer/generated/bookServer'
import graphqlFetch, { type GraphqlRequestBody } from '@/lib/graphqlFetch'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'

export default async function getPageMetadata(bookUrlSlug: string, cookies: NextApiRequestCookies) {
  try {
    const headers = {}
    const token = cookies.access_token

    if (token) {
      Object.assign(headers, { authorization: `Bearer ${token}` })
    }

    const body: GraphqlRequestBody = {
      operationName: 'getPageMetadata',
      query: GetPageMetadataDocument,
      variables: {
        input: {
          book_url_slug: bookUrlSlug,
        },
      },
    }

    const { getPageMetadata } = await graphqlFetch<GetPageMetadataQuery>({
      method: 'GET',
      body,
      headers,
    })

    return getPageMetadata
  } catch (error) {
    console.log('getPageMetadata error', error)
    return null
  }
}
