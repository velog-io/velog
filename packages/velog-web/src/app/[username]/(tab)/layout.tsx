import getVelogConfig from '@/prefetch/getVelogConfig'
import VelogLayout from '@/components/Layouts/VelogLayout'
import { getUsernameFromParams } from '@/lib/utils'
import { UserLogo } from '@/state/header'
import { notFound } from 'next/navigation'
import getUserFollowerInfo from '@/prefetch/getUserFollowerInfo'
import UserProfile from '@/components/UserProfile'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export default async function VelogPageLayout({ children, params }: Props) {
  const username = getUsernameFromParams(params)
  const user = await getUserFollowerInfo(username)
  const velogConfig = await getVelogConfig(username)

  if (!user || !velogConfig) {
    notFound()
  }

  const userLogo: UserLogo = {
    title: velogConfig.title,
    logo_image: velogConfig.logo_image,
  }

  return (
    <VelogLayout
      username={username}
      userLogo={userLogo}
      userProfile={
        <UserProfile
          userId={user.id}
          username={username}
          followersCount={user.followers_count}
          followingsCount={user.followings_count}
          isFollowed={user.is_followed}
          profile={user.profile}
        />
      }
    >
      {children}
    </VelogLayout>
  )
}
