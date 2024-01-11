import getUser from '@/prefetch/getUser'
import getUserTags from '@/prefetch/getUserTags'
import VelogSearchInput from '@/features/velog/components/VelogSearchInput'
import { getTagByKey, getUsernameFromParams } from '@/lib/utils'
import { Metadata } from 'next'
import VelogSearchPosts from '@/features/velog/components/VelogSearchPosts'
import VelogPosts from '@/features/velog/components/VelogPosts'
import getVelogPosts from '@/prefetch/getVelogPosts'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'

interface Props {
  params: { username: string }
  searchParams: { tag?: string | string[]; q?: string | string[] }
}

export default async function VelogPostsPage({ params, searchParams }: Props) {
  const token = cookies().get('access_token') || cookies().get('refresh_token')
  const tag = getTagByKey(searchParams, 'tag')
  const query = getTagByKey(searchParams, 'q')
  const username = getUsernameFromParams(params)
  const posts = await getVelogPosts({ username, tag, accessToken: token?.value })

  const userTags = await getUserTags({ username, accessToken: token?.value })

  if (!posts || !userTags) {
    notFound()
  }

  return (
    <>
      <VelogSearchInput query={query} username={username} />
      {query ? (
        <VelogSearchPosts username={username} tag={tag} userTags={userTags} keyword={query} />
      ) : (
        <VelogPosts username={username} tag={tag} userTags={userTags} initialData={posts} />
      )}
    </>
  )
}

export async function generateMetadata({ searchParams, params }: Props): Promise<Metadata> {
  const username = getUsernameFromParams(params)
  const user = await getUser(username)

  const query = getTagByKey(searchParams, 'q')

  if (!user) {
    return {}
  }

  const profile = user.profile
  const basic = `${username} (${profile.display_name}) / 작성글 - velog`
  const search = `"${query}" 검색 결과 - velog`
  const title = query ? search : basic

  return {
    title,
    description: `${username}님이 작성한 포스트 시리즈들을 확인해보세요.`,
  }
}
