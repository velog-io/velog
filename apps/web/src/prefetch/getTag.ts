import { TagDocument } from '@/graphql/server/generated/server'
import graphqlFetch, { GraphqlRequestBody } from '@/lib/graphqlFetch'

export type TagData = {
  id: string
  name: string
  posts_count: number
  description: string | null
  thumbnail: string | null
}

export default async function getTag(name: string): Promise<TagData | null> {
  try {
    const body: GraphqlRequestBody = {
      operationName: 'tag',
      query: TagDocument,
      variables: {
        name,
      },
    }

    const { tag } = await graphqlFetch<{ tag: TagData | null }>({
      method: 'GET',
      body,
      next: { revalidate: 60 },
    })

    return tag
  } catch (error) {
    console.log('getTag error', error)
    return null
  }
}
