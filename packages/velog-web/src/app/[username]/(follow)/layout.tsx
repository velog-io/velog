import ResponsiveLayout from '@/components/Layouts/ResponsiveLayout'
import { getUsernameFromParams } from '@/lib/utils'
import getUserFollowInfo from '@/prefetch/getUserFollowInfo'
import getVelogConfig from '@/prefetch/getVelogConfig'
import { UserLogo } from '@/state/header'
import { notFound } from 'next/navigation'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export default async function Layout({ children, params }: Props) {
  const username = getUsernameFromParams(params)
  const user = await getUserFollowInfo(username)
  const velogConfig = await getVelogConfig(username)

  if (!user || !velogConfig) {
    notFound()
  }

  const userLogo: UserLogo = {
    title: velogConfig.title,
    logo_image: velogConfig.logo_image,
  }

  return (
    <ResponsiveLayout isCustomHeader={true} username={username} userLogo={userLogo}>
      {children}
    </ResponsiveLayout>
  )
}
