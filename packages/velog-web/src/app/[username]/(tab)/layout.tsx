import getVelogConfig from '@/prefetch/getVelogConfig'
import VelogLayout from '@/components/Layouts/VelogLayout'
import { getUsernameFromParams } from '@/lib/utils'
import { UserLogo } from '@/state/header'
import { notFound } from 'next/navigation'
import getUserFollowInfo from '@/prefetch/getUserFollowInfo'
import UserProfile from '@/components/UserProfile'
import BasicLayout from '@/components/Layouts/BasicLayout'
import getNotificationCount from '@/prefetch/getNotificationCount'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export default async function VelogPageLayout({ children, params }: Props) {
  const username = getUsernameFromParams(params)
  const user = await getUserFollowInfo(username)
  const velogConfig = await getVelogConfig({ username })
  const notificationCount = await getNotificationCount()

  if (!user || !velogConfig) {
    notFound()
  }

  const userLogo: UserLogo = {
    title: velogConfig.title,
    logo_image: velogConfig.logo_image,
  }

  return (
    <BasicLayout
      isCustomHeader={true}
      userLogo={userLogo}
      username={username}
      notificationCount={notificationCount}
    >
      <VelogLayout
        userProfile={
          <UserProfile
            userId={user.id}
            followersCount={user.followers_count}
            followingsCount={user.followings_count}
            isFollowed={user.is_followed}
            profile={user.profile}
          />
        }
      >
        {children}
      </VelogLayout>
    </BasicLayout>
  )
}
