import getUser from '@/prefetch/getUser'
import VelogSeries from '@/features/velog/components/VelogSeries'
import { getUsernameFromParams } from '@/lib/utils'
import { Metadata } from 'next'

interface Props {
  params: { username: string }
}

export default function VelogSeriesPage({ params }: Props) {
  const username = getUsernameFromParams(params)
  return <VelogSeries username={username} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = getUsernameFromParams(params)
  const user = await getUser(username)

  if (!user) {
    return {}
  }

  const profile = user.profile
  return {
    title: `${username} (${profile.display_name}) / 시리즈 - velog`,
    description: `${username}님이 작성한 포스트 시리즈들을 확인해보세요.`,
  }
}
