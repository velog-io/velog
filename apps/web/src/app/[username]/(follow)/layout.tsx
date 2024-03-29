import SmallLayout from '@/components/Layouts/SmallLayout'
import { getUsernameFromParams } from '@/lib/utils'
import getUserFollowInfo from '@/prefetch/getUserFollowInfo'
import getVelogConfig from '@/prefetch/getVelogConfig'
import { UserLogo } from '@/state/header'
import { notFound } from 'next/navigation'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export default async function VelogFollowLayout({ children, params }: Props) {
  const username = getUsernameFromParams(params)
  const user = await getUserFollowInfo(username)

  if (!user) {
    notFound()
  }

  const velogConfig = await getVelogConfig({ username })
  if (!velogConfig) {
    notFound()
  }

  const userLogo: UserLogo = {
    title: velogConfig.title,
    logo_image: velogConfig.logo_image,
  }

  return (
    <SmallLayout isCustomHeader={true} username={username} userLogo={userLogo}>
      {children}
    </SmallLayout>
  )
}
