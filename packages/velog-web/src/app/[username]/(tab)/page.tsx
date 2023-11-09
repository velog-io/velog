import getUserProfile from '@/actions/getUserProfile'
import { getUsernameFromParams } from '@/lib/utils'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface Props {
  params: { username: string }
}

export default async function VelogPage({ params }: Props) {
  const username = getUsernameFromParams(params)
  redirect(`/@${username}/posts`)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params

  const username = getUsernameFromParams(params)
  const profile = await getUserProfile(username)

  if (!profile) {
    return {}
  }

  return {
    title: `${username} (${profile.display_name}) - velog`,
    description: `${profile.short_bio}`,
  }
}
