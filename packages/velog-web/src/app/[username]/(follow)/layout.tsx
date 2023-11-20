import VelogFollowLayout from '@/components/Layouts/VelogFollowLayout'
import { getUsernameFromParams } from '@/lib/utils'
import getUserFollowerInfo from '@/prefetch/getUserFollowerInfo'
import getVelogConfig from '@/prefetch/getVelogConfig'
import { UserLogo } from '@/state/header'
import { notFound } from 'next/navigation'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export default async function Layout({ children, params }: Props) {
  const username = getUsernameFromParams(params)
  const user = await getUserFollowerInfo(username)
  const velogConfig = await getVelogConfig(username)

  console.log('user', user)
  if (!user || !velogConfig) {
    notFound()
  }

  const userLogo: UserLogo = {
    title: velogConfig.title,
    logo_image: velogConfig.logo_image,
  }

  return (
    <VelogFollowLayout username={username} userLogo={userLogo}>
      {children}
    </VelogFollowLayout>
  )
}
