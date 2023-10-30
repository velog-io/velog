import getUserProfile from '@/actions/getUserProfile'
import UserProfile from '@/components/UserProfile'
import { ProfileLinks } from '@/types/user'
import { notFound } from 'next/navigation'

interface Props {
  params: { username: string }
}

export default async function VelogPage({ params }: Props) {
  const encodedSymbol = encodeURIComponent('@')
  const username = params.username.replace(encodedSymbol, '')

  const profile = await getUserProfile(username)

  if (!profile) {
    notFound()
  }

  return (
    <UserProfile
      displayName={profile.display_name}
      description={profile.short_bio}
      profileLinks={profile.profile_links as ProfileLinks}
      thumbnail={profile.thumbnail}
      username={username}
    />
  )
}
