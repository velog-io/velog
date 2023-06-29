import { useCurrentUserQuery } from '@/graphql/generated'
import { useAuth } from '@/state/auth'
import { CurrentUser } from '@/types/user'
import { useEffect } from 'react'

export function useUserLoader() {
  const { data } = useCurrentUserQuery<{
    currentUser: CurrentUser
  }>()

  const {
    value: { user: prevUser },
    actions: { update },
  } = useAuth()

  const currentUser = data?.currentUser

  useEffect(() => {
    if (!currentUser) return
    if (prevUser !== currentUser) {
      update(currentUser)
    }
  }, [currentUser, update, prevUser])

  useEffect(() => {
    if (!currentUser) return
  }, [currentUser])
}
