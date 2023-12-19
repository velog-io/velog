import SettingEmailRow from '@/features/setting/components/SettingEmailRow'
import SettingSocialInfoRow from '@/features/setting/components/SettingSocialInfoRow'
import SettingTitleRow from '@/features/setting/components/SettingTitleRow'
import SettingUserProfile from '@/features/setting/components/SettingUserProfile'
import getCurrentUser from '@/prefetch/getCurrentUser'
import getVelogConfig from '@/prefetch/getVelogConfig'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function SettingPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('access_token') || cookieStore.get('refresh_token')

  const user = await getCurrentUser(token)

  if (!user) {
    notFound()
  }

  const velogConfig = await getVelogConfig(user.username)

  if (!velogConfig) {
    notFound()
  }

  return (
    <>
      <SettingUserProfile
        thumbnail={user.profile.thumbnail}
        displayName={user.profile.display_name}
        shortBio={user.profile.short_bio}
      />
      <SettingTitleRow title={velogConfig.title || `${user.username}.log`} />
      <SettingSocialInfoRow {...user.profile.profile_links} />
      <SettingEmailRow email={user.email!} />
    </>
  )
}
