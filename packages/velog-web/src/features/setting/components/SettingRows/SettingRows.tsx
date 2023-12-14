'use client'

import { ProfileLinks } from '@/types/user'
import styles from './SettingRows.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import SettingTitleRow from '../SettingTitleRow'
import SettingSocialInfoRow from '../SettingSocialInfoRow'
import SettingEmailRow from '../SettingEmailRow'
import SettingEmailRulesRow from '../SettingEmailRulesRow'
import SettingUnregisterRow from '../SettingUnregisterRow'

const cx = bindClassNames(styles)

type Props = {
  title: string | null
  username: string
  email: string
  isEmailSent: boolean
  onUpdateTitle: (title: string) => Promise<any>
  onChangeEmail: (email: string) => Promise<any>
  onUpdateSocialInfo: (profileLinks: ProfileLinks) => Promise<any>
  onUpdateEmailRules: (params: { promotion: boolean; notification: boolean }) => Promise<any>
  onUnregister: () => void
  profileLinks: {
    url?: string
    github?: string
    facebook?: string
    twitter?: string
    email?: string
  }
  userMeta: {
    id: string
    email_notification: boolean
    email_promotion: boolean
  }
}

function SettingRows({
  title,
  username,
  profileLinks,
  userMeta,
  email,
  onUpdateTitle,
  onChangeEmail,
  onUpdateSocialInfo,
  onUpdateEmailRules,
  onUnregister,
  isEmailSent,
}: Props) {
  return (
    <div className={cx('block')}>
      <SettingTitleRow
        title={title || createFallbackTitle(username)}
        onUpdateTitle={onUpdateTitle}
      />
      <SettingSocialInfoRow {...profileLinks} onUpdate={onUpdateSocialInfo} />
      <SettingEmailRow email={email} onChangeEmail={onChangeEmail} isEmailSent={isEmailSent} />
      {userMeta && (
        <SettingEmailRulesRow
          notification={userMeta.email_notification}
          promotion={userMeta.email_promotion}
          onUpdate={onUpdateEmailRules}
        />
      )}
      <SettingUnregisterRow onUnregister={onUnregister} />
    </div>
  )
}

export default SettingRows
