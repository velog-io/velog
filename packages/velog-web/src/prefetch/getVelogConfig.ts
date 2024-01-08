import { VelogConfig, VelogConfigDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export default async function getVelogConfig({ username, accessToken }: Args) {
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

    const headers = {}
    if (accessToken) {
      Object.assign(headers, {
        authorization: `Bearer ${accessToken.value}`,
      })
    }

    const { velogConfig } = await graphqlFetch<{ velogConfig: VelogConfig }>({
      body,
      next: { revalidate: 0 },
      headers,
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
  accessToken?: RequestCookie
}
