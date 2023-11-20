import VelogFollowStats from '@/features/velog/components/VelogFollowStats'
import VelogFollowers from '@/features/velog/components/VelogFollowers'
import { getUsernameFromParams } from '@/lib/utils'
import getUserFollowerInfo from '@/prefetch/getUserFollowerInfo'
import { notFound } from 'next/navigation'

type Props = {
  params: { username: string }
}

export default async function VelogFollowersPage({ params }: Props) {
  const username = getUsernameFromParams(params)
  const user = await getUserFollowerInfo(username)

  const profile = user?.profile

  if (!profile) {
    notFound()
  }

  return (
    <>
      <VelogFollowStats
        username={username}
        displayName={profile.display_name}
        thumbnail={profile.thumbnail}
        totalCount={user.followers_count}
        category="팔로워"
        text="의 팔로워"
        type="follower"
      />
      <VelogFollowers username={username} />
    </>
  )
}
