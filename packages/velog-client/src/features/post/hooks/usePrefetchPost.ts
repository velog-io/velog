import { ReadPostInput, getSdk, graphQLClient } from '@/graphql/generated'
import { sdk } from '@/lib/sdk'

export default function usePrefetchPost({ username, url_slug }: ReadPostInput) {
  return sdk.readPost({
    input: { username, url_slug },
  })
}
