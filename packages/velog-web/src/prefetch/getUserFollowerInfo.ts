import { GetUserFollowInfoDocument, User } from '@/graphql/generated'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export default async function getUserFollowerInfo(username: string) {
  if (!username) return null
  try {
    const body: GraphqlRequestBody = {
      operationName: 'getUserFollowInfo',
      query: GetUserFollowInfoDocument,
      variables: {
        input: {
          username,
        },
      },
    }

    const { user } = await graphqlFetch<{ user: User }>({
      body,
      next: { revalidate: 0 },
    })

    if (!user) {
      return null
    }

    return { ...user, profile: user.profile! }
  } catch (error) {
    console.log('getUserFollowerInfo error', error)
    return null
  }
}
