import { useCurrentUserQuery } from '@/graphql/generated'
import { setCrispUser } from '@/lib/crisp'
import { useAuth } from '@/state/auth'
import { CurrentUser } from '@/types/user'
import { useEffect } from 'react'

export function useUserLoader() {
  const { data } = useCurrentUserQuery<{
    currentUser: CurrentUser
  }>({}, { cacheTime: 1000 })

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
    setCrispUser({
      email: currentUser.email,
      nickname: currentUser.username,
      avatar: currentUser.profile.thumbnail,
    })
  }, [currentUser])
}
