import getUserProfile from '@/actions/getUserProfile'
import getUserTags from '@/actions/getUserTags'
import VelogPosts from '@/features/velog/components/VelogPosts'
import VelogTag from '@/features/velog/components/VelogTag'
import { getUsernameFromParams } from '@/lib/utils'
import { Metadata } from 'next'

interface Props {
  params: { username: string }
  searchParams: { tag: string }
}

export default async function VelogPostsPage({ params, searchParams }: Props) {
  const tag = Array.isArray(searchParams.tag) ? searchParams.tag[0] : searchParams.tag
  const username = getUsernameFromParams(params)

  const userTags = await getUserTags(username)
  return (
    <>
      <VelogPosts username={username} tag={tag} />
      <VelogTag userTags={userTags} tag={tag} username={username} />
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = getUsernameFromParams(params)
  const profile = await getUserProfile(username)

  if (!profile) {
    return {}
  }

  return {
    title: `${username} (${profile.display_name}) / 시리즈 - velog`,
    description: `${username}님이 작성한 포스트 시리즈들을 확인해보세요.`,
  }
}
