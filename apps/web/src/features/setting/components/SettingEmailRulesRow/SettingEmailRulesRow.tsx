'use client'

import ToggleSwitch from '@/components/ToggleSwitch'
import SettingRow from '../SettingRow'
import styles from './SettingEmailRulesRow.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useEffect, useState } from 'react'
import { useCurrentUserQuery, useUpdateEmailRulesMutation } from '@/graphql/server/generated/server'

const cx = bindClassNames(styles)

type Props = {
  notification: boolean
  promotion: boolean
}

function SettingEmailRulesRow(props: Props) {
  const [promotion, setPromotion] = useState<boolean>(props.promotion)
  const [notification, setNotification] = useState<boolean>(props.notification)

  const { data, refetch: currentUserRefetch } = useCurrentUserQuery()
  const { mutateAsync } = useUpdateEmailRulesMutation({ retryDelay: 1000 })

  const onChange = async ({ name, value }: { name: string; value: boolean }) => {
    const input = { promotion, notification, [name]: value }
    await mutateAsync({ input })
    currentUserRefetch()
  }

  useEffect(() => {
    if (!data?.currentUser) return
    const userMeta = data?.currentUser.user_meta
    if (!userMeta) return
    setPromotion(userMeta.email_promotion ?? false)
    setNotification(userMeta?.email_notification ?? false)
  }, [data?.currentUser])

  return (
    <SettingRow title="이메일 수신 설정" className={cx('block')}>
      <ul className={cx('rules')}>
        <li>
          <span>댓글 알림</span>
          <ToggleSwitch
            className={cx('toggle')}
            value={notification}
            name="notification"
            onChange={onChange}
          />
        </li>
        <li>
          <span>벨로그 업데이트 소식</span>
          <ToggleSwitch
            className={cx('toggle')}
            value={promotion}
            name="promotion"
            onChange={onChange}
          />
        </li>
      </ul>
    </SettingRow>
  )
}

export default SettingEmailRulesRow
