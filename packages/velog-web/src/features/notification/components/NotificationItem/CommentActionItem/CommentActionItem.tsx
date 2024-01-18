'use client'

import styles from './CommentActionItem.module.css'
import itemStyles from '../NotificationItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { CommentNotificationAction } from '@/graphql/helpers/generated'
import { NotificationNotMerged } from '@/features/notification/hooks/useNotificationMerge'
import Link from 'next/link'
import Thumbnail from '@/components/Thumbnail'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import NotificationSkeletonItem from '../NotificationSkeletonItem'

const cx = bindClassNames({ ...styles, ...itemStyles })

type Props = {
  action: CommentNotificationAction
  index: number
} & NotificationNotMerged

function CommentActionItem({ action, created_at, index }: Props) {
  const velogUrl = `/@${action.actor_username}/posts`
  const { time, isLoading } = useTimeFormat(created_at)

  if (isLoading) {
    return <NotificationSkeletonItem index={index} />
  }

  console.log('action.actor_thumbnail', action.actor_thumbnail)

  return (
    <li className={cx('block', 'item')}>
      <Link href={velogUrl}>
        <Thumbnail
          className={cx('thumbnail')}
          src={action.actor_thumbnail}
          alt={action.actor_display_name}
        />
      </Link>
      <div className={cx('content')}>
        <Link href={velogUrl}>{action.actor_display_name}</Link> 님이
        <span className={cx('postTitle')}>{action.post_title.slice(0, 10)}...</span>
        <span>포스트에 댓글을 작성하였습니다:</span>
        <span className={cx('comment')}>{action.comment_text.slice(0, 100)}</span>
        <span className={cx('time')}>{time}</span>
      </div>
    </li>
  )
}

export default CommentActionItem
