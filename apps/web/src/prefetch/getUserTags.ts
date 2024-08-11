import { UserTags, UserTagsDocument } from '@/graphql/server/generated/server'
import { getAccessToken } from '@/lib/auth'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getUserTags(username: string) {
  try {
    const headers = {}
    const token = await getAccessToken()
    if (token) {
      Object.assign(headers, { authorization: `Bearer ${token.value}` })
    }

    const body: GraphqlRequestBody = {
      operationName: 'userTags',
      query: UserTagsDocument,
      variables: {
        input: {
          username,
        },
      },
    }

    const { userTags } = await graphqlFetch<{ userTags: UserTags }>({
      method: 'GET',
      body,
      next: { revalidate: 20 },
      headers,
    })

    return userTags
  } catch (error) {
    return null
  }
}
