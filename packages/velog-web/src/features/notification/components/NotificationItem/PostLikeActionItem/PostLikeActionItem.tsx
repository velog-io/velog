'use client'

import { PostLikeNotificationAction } from '@/graphql/helpers/generated'
import styles from './PostLikeActionItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { NotificationMergedType } from '@/features/notification/hooks/useNotificationMerge'

const cx = bindClassNames(styles)

type Props = { action: PostLikeNotificationAction; className: string } & NotificationMergedType

function PostLikeActionItem({ className, created_at, isMerged }: Props) {
  return (
    <li className={cx('block', className)}>
      {created_at}
      {isMerged ? 'true' : 'false'}
    </li>
  )
}

export default PostLikeActionItem
