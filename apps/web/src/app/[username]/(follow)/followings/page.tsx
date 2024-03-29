import VelogFollowStats from '@/features/velog/components/VelogFollowStats'
import VelogFollowings from '@/features/velog/components/VelogFollowings'
import { getUsernameFromParams } from '@/lib/utils'
import getUserFollowInfo from '@/prefetch/getUserFollowInfo'
import { notFound } from 'next/navigation'

type Props = {
  params: { username: string }
}

export default async function VelogFollwingsPage({ params }: Props) {
  const username = getUsernameFromParams(params)
  const user = await getUserFollowInfo(username)

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
        followCount={user.followings_count}
        category="팔로우"
        text="을 팔로우 중"
        type="following"
      />
      <VelogFollowings username={username} />
    </>
  )
}
