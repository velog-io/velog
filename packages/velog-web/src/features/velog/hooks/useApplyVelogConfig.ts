import { useVelogConfigQuery } from '@/graphql/generated'
import { UserLogo, useHeader } from '@/state/header'
import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function useApplyVelogConfig(username: string) {
  const { actions } = useHeader()
  const [userLogo, setUserLogo] = useState<UserLogo | null>(null)
  const { data, error, isLoading } = useVelogConfigQuery({ input: { username } })

  if (error || !data) {
    console.log(error)
  }

  useEffect(() => {
    actions.enterUserVelog({ username })
  }, [actions, username])

  useEffect(() => {
    return () => {
      actions.leaveUserVelog()
    }
  }, [actions])

  useEffect(() => {
    if (data && data.velogConfig === null) {
      notFound()
    }

    if (!data || !data.velogConfig) return

    const { title, logo_image } = data.velogConfig

    setUserLogo({
      title,
      logo_image,
    })

    actions.enterUserVelog({
      username,
      userLogo: {
        title,
        logo_image,
      },
    })
  }, [data, actions, username])

  return { userLogo, error, isLoading }
}
