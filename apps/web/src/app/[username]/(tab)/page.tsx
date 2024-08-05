import getUser from '@/prefetch/getUser'
import { getUsernameFromParams } from '@/lib/utils'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface Props {
  params: { username: string }
}

export default async function VelogPage({ params }: Props) {
  const encodedSymbol = encodeURIComponent('@')
  if (params.username.includes(encodedSymbol)) {
    const username = getUsernameFromParams(params)
    redirect(`/@${username}/posts`)
  }
  redirect(params.username)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = getUsernameFromParams(params)
  const user = await getUser(username)

  if (!user) {
    return {}
  }

  const profile = user.profile
  return {
    title: `${username} (${profile.display_name}) - velog`,
    description: `${profile.short_bio}`,
  }
}
