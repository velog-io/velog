import getUserProfile from '@/actions/getUserProfile'
import VelogPageLayout from '@/components/Layouts/VelogPageLayout'
import { ProfileLinks } from '@/types/user'
import { notFound } from 'next/navigation'

type Props = {
  params: { username: string }
  children: React.ReactNode
}

export default async function VelogLayout({ children, params }: Props) {
  const encodedSymbol = encodeURIComponent('@')
  const username = params.username.replace(encodedSymbol, '')

  const profile = await getUserProfile(username)

  if (!profile) {
    notFound()
  }

  return (
    <VelogPageLayout
      displayName={profile.display_name}
      profileLikns={profile.profile_links as ProfileLinks}
      shortBio={profile.short_bio}
      thumbnail={profile.thumbnail}
      username={username}
    >
      {children}
    </VelogPageLayout>
  )
}
