import getUserProfile from '@/actions/getUserProfile'
import getUserTags from '@/actions/getUserTags'
import VelogPosts from '@/features/velog/components/VelogPosts'
import VelogSearchInput from '@/features/velog/components/VelogSearchInput'
import { getTagByKey, getUsernameFromParams } from '@/lib/utils'
import { Metadata } from 'next'

interface Props {
  params: { username: string }
  searchParams: { tag?: string | string[]; q?: string | string[] }
}

export default async function VelogPostsPage({ params, searchParams }: Props) {
  const tag = getTagByKey(searchParams, 'tag')
  const query = getTagByKey(searchParams, 'q')
  const username = getUsernameFromParams(params)
  const userTags = await getUserTags(username)

  return (
    <>
      <VelogSearchInput query={query} username={username} />
      <VelogPosts username={username} tag={tag} userTags={userTags} />
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
    title: `${username} (${profile.display_name}) / 작성글 - velog`,
    description: `${username}님이 작성한 포스트 시리즈들을 확인해보세요.`,
  }
}
