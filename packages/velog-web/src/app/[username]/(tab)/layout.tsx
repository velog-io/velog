import getUser from '@/prefetch/getUser'
import getVelogConfig from '@/prefetch/getVelogConfig'
import VelogLayout from '@/components/Layouts/VelogLayout'
import { getUsernameFromParams } from '@/lib/utils'
import { UserLogo } from '@/state/header'
import { ProfileLinks } from '@/types/user'
import { notFound } from 'next/navigation'
import UserProfile from '@/components/UserProfile'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export default async function VelogLayout({ children, params }: Props) {
  const username = getUsernameFromParams(params)
  const user = await getUser(username)
  const velogConfig = await getVelogConfig(username)
  if (!user || !velogConfig) {
    notFound()
  }

  const profile = user.profile

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
          displayName={profile.display_name}
          shortBio={profile.short_bio}
          profileLinks={profile.profile_links as ProfileLinks}
          thumbnail={profile.thumbnail}
          username={username}
          followersCount={user.followers_count}
          followingsCount={user.followings_count}
          userId={user.id}
          isFollowing={user.is_following}
        />
      }
    >
      {children}
    </VelogLayout>
  )
}
