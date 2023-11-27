import { TrendingWriter, TrendingWritersDocument } from '@/graphql/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getTrendingWriters() {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'trendingWriters',
      query: TrendingWritersDocument,
      variables: {
        input: {
          cursor: 0,
          limit: 30,
        },
      },
    }

    const { trendingWriters } = await graphqlFetch<{ trendingWriters: TrendingWriter[] }>({
      method: 'GET',
      body,
      next: { revalidate: 60 * 10 },
    })

    if (!trendingWriters) {
      return []
    }

    return trendingWriters
  } catch (error) {
    console.log('getTrendingWriters error: ', error)
    return []
  }
}
