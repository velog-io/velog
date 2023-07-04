import { ReadPostInput, getSdk, graphQLClient } from '@/graphql/generated'
import { sdk } from '@/lib/sdk'

export default async function usePrefetchPost({
  username,
  url_slug,
}: ReadPostInput) {
  const { post } = await sdk.readPost({
    input: { username, url_slug },
  })
  return post
}
