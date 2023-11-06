import getUserProfile from '@/actions/getUserProfile'
import { Metadata } from 'next'

interface Props {
  params: { username: string }
}

export default async function VelogPage({}: Props) {
  return <></>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const encodedSymbol = encodeURIComponent('@')
  const username = params.username.replace(encodedSymbol, '')
  const profile = await getUserProfile(username)

  if (!profile) {
    return {}
  }

  return {
    title: `${username} (${profile.display_name}) - velog`,
    description: `${profile.short_bio}`,
  }
}
