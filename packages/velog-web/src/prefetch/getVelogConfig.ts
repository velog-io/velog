import { VelogConfig, VelogConfigDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getVelogConfig({ username }: Args) {
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
      next: { revalidate: 0 },
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

type Args = {
  username: string
}
