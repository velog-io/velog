import { AdsDocument, AdsInput, AdsQuery } from '@/graphql/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getAds({ type, limit }: AdsInput) {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'ads',
      query: AdsDocument,
      variables: {
        input: {
          type,
          limit,
        },
      },
    }

    const { ads } = await graphqlFetch<{ ads: AdsQueryResult[] }>({
      method: 'GET',
      body,
    })

    return ads
  } catch (error) {
    console.log('getAds error', error)
    return []
  }
}

export type AdsQueryResult = {
  id: string
  body: string
  title: string
  image: string
  url: string
  start_date: string
}
