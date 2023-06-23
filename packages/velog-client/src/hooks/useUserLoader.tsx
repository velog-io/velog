import { useCurrentUserQuery } from '@/graphql/generated'
import { useAuth } from '@/state/auth'
import { CurrentUser } from '@/types/user'
import { useEffect } from 'react'

export function useUserLoader() {
  const { data, error } = useCurrentUserQuery<{ currentUser: CurrentUser }>(
    {},
    { cacheTime: 0 }
  )

  const {
    actions: { update },
  } = useAuth()

  useEffect(() => {
    if (!error) {
      update(data?.currentUser)
    }
  }, [data, update, error])
}
