import { VelogConfig, VelogConfigDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getVelogConfig(username: string) {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'velogConfig',
      query: VelogConfigDocument,
      variables: {
        input: {
          username,
        },
      },
    }

    const { velogConfig } = await graphqlFetch<{ velogConfig: VelogConfig }>({
      body,
      next: { revalidate: 30 },
    })

    if (!velogConfig) {
      return null
    }

    return velogConfig
  } catch (error) {
    console.log('getVelogConfig error', error)
    return null
  }
}
