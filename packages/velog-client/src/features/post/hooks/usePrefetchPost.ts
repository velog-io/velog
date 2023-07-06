import { ReadPostInput, getSdk, graphQLClient } from '@/graphql/generated'
import { sdk } from '@/lib/sdk'
import { useCallback } from 'react'

export default function usePrefetchPost({ username, url_slug }: ReadPostInput) {
  return useCallback(() => {
    sdk.readPost({
      input: { id: undefined, username, url_slug },
    })
  }, [username, url_slug])
}
