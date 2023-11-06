import getUserProfile from '@/actions/getUserProfile'
import getVelogConfig from '@/actions/getVelogConfig'
import VelogPageLayout from '@/components/Layouts/VelogPageLayout'
import { getUsernameFromParams } from '@/lib/utils'
import { UserLogo } from '@/state/header'
import { ProfileLinks } from '@/types/user'
import { notFound } from 'next/navigation'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export default async function VelogLayout({ children, params }: Props) {
  const username = getUsernameFromParams(params)
  const profile = await getUserProfile(username)
  const velogConfig = await getVelogConfig(username)

  if (!profile || !velogConfig) {
    notFound()
  }

  const userLogo: UserLogo = {
    title: velogConfig.title,
    logo_image: velogConfig.logo_image,
  }

  return (
    <VelogPageLayout
      displayName={profile.display_name}
      profileLikns={profile.profile_links as ProfileLinks}
      shortBio={profile.short_bio}
      thumbnail={profile.thumbnail}
      username={username}
      userLogo={userLogo}
    >
      {children}
    </VelogPageLayout>
  )
}
