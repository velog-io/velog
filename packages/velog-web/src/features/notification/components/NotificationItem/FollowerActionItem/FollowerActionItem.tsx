'use client'

import { NotificationMergedType } from '@/features/notification/hooks/useNotificationMerge'
import styles from './FollowerActionItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { FollowerNotificationAction } from '@/graphql/helpers/generated'

const cx = bindClassNames(styles)

type Props = { action: FollowerNotificationAction; className: string } & NotificationMergedType

function FollowerActionItem({ action, className, created_at }: Props) {
  return <li className={cx('block', className)}>{created_at}</li>
}

export default FollowerActionItem
