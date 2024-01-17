'use client'

import { NotificationMergedType } from '@/features/notification/hooks/useNotificationMerge'
import styles from './CommentActionItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { CommentNotificationAction } from '@/graphql/helpers/generated'

const cx = bindClassNames(styles)

type Props = { action: CommentNotificationAction; className: string } & NotificationMergedType

function CommentActionItem({ created_at, className, isMerged }: Props) {
  return (
    <li className={cx('block', className)}>
      {created_at}
      {isMerged ? 'true' : 'false'}
    </li>
  )
}

export default CommentActionItem
