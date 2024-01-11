import { UserTags, UserTagsDocument } from '@/graphql/helpers/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export default async function getUserTags({ username, accessToken }: GetUserTagsArgs) {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'userTags',
      query: UserTagsDocument,
      variables: {
        input: {
          username,
        },
      },
    }

    const headers = {}
    if (accessToken) {
      Object.assign(headers, { authorization: `Bearer ${accessToken.value}` })
    }

    const { userTags } = await graphqlFetch<{ userTags: UserTags }>({
      body,
      next: { revalidate: 20 },
      headers,
    })

    return userTags
  } catch (error) {
    console.log(error)
    throw new Error('Get user tags error')
  }
}

type GetUserTagsArgs = {
  username: string
  accessToken?: RequestCookie
}
