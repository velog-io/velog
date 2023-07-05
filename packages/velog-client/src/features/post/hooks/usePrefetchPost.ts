import { ReadPostInput, getSdk, graphQLClient } from '@/graphql/generated'
import { sdk } from '@/lib/sdk'
import { useCallback } from 'react'

export default function usePrefetchPost({ username, url_slug }: ReadPostInput) {
  return useCallback(() => {
    const a = sdk.readPost({
      input: { username, url_slug },
    })
    console.log('a', a)
  }, [username, url_slug])
}
