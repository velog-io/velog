'use client'

import { PostLikeNotificationAction } from '@/graphql/helpers/generated'
import itemStyles from '../NotificationItem.module.css'
import styles from './PostLikeActionItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { NotificationMerged } from '@/features/notification/hooks/useNotificationMerge'

const cx = bindClassNames({ ...styles, ...itemStyles })

type Props = { action: PostLikeNotificationAction } & NotificationMerged

function PostLikeActionItem({ created_at, isMerged }: Props) {
  return (
    <li className={cx('block', 'item')}>
      {created_at}
      {isMerged ? 'true' : 'false'}
    </li>
  )
}

export default PostLikeActionItem
