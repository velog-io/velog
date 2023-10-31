import getUserProfile from '@/actions/getUserProfile'
import VelogPage from '../page'
import { Metadata } from 'next'

interface Props {
  params: { username: string }
}

export default async function VelogPosts({ params }: Props) {
  return (
    <>
      <VelogPage params={params} />
      <div>velogPosts</div>
    </>
  )
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
    title: `${username} (${profile.display_name}) / 시리즈 - velog`,
    description: `${username}님이 작성한 포스트 시리즈들을 확인해보세요.`,
  }
}
