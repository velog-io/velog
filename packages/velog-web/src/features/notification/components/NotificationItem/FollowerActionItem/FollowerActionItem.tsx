'use client'

import { NotificationNotMerged } from '@/features/notification/hooks/useNotificationMerge'
import itemStyles from '../NotificationItem.module.css'
import styles from './FollowerActionItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { FollowerNotificationAction } from '@/graphql/helpers/generated'

const cx = bindClassNames({ ...styles, ...itemStyles })

type Props = { action: FollowerNotificationAction } & NotificationNotMerged

function FollowerActionItem({ action, created_at }: Props) {
  return <li className={cx('block', 'item')}>{created_at}</li>
}

export default FollowerActionItem
