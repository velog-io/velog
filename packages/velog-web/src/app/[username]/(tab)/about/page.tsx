import getUserProfile from '@/actions/getUserProfile'
import VelogPage from '../../page'
import { Metadata } from 'next'
import strip from 'strip-markdown'
import { remark } from 'remark'

interface Props {
  params: { username: string }
}

export default async function VelogAbout({ params }: Props) {
  return (
    <>
      <VelogPage params={params} />
      <div>velog About</div>
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
    title: `${username} (${profile.display_name}) / 소개 - velog`,
    description: profile?.about
      ? `${await remark().use(strip).process(profile.about)}`
      : `${username}님의 자기소개가 비었습니다.`,
  }
}
