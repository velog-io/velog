import { ReadPostInput, getSdk, graphQLClient } from '@/graphql/generated'

export default async function usePrefetchPost({
  username,
  url_slug,
}: ReadPostInput) {
  const sdk = getSdk(graphQLClient)
  const { post } = await sdk.readPost({
    input: { username, url_slug },
  })
  return post
}
