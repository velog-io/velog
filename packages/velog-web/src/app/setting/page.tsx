'use client'

import SettingEmailRow from '@/features/setting/components/SettingEmailRow'
import SettingEmailRulesRow from '@/features/setting/components/SettingEmailRulesRow'
import SettingSocialInfoRow from '@/features/setting/components/SettingSocialInfoRow'
import SettingThemeRow from '@/features/setting/components/SettingThemeRow'
import SettingTitleRow from '@/features/setting/components/SettingTitleRow'
import SettingUnregisterRow from '@/features/setting/components/SettingUnregisterRow'
import SettingUserProfile from '@/features/setting/components/SettingUserProfile'
import { useCurrentUserQuery, useVelogConfigQuery } from '@/graphql/helpers/generated'
import { notFound } from 'next/navigation'

export default function SettingPage() {
  const { data: currentUserData } = useCurrentUserQuery()

  const user = currentUserData?.currentUser

  if (!user) {
    notFound()
  }

  const { data: velogConfigData } = useVelogConfigQuery({ input: { username: user.username } })

  const velogConfig = velogConfigData?.velogConfig

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
      <SettingEmailRulesRow
        notification={user.user_meta?.email_notification || false}
        promotion={user.user_meta?.email_promotion || false}
      />
      <SettingThemeRow />
      <SettingUnregisterRow />
    </>
  )
}
