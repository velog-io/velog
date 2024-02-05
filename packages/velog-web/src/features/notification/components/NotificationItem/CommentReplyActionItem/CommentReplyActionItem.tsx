'use client'

import { CommentReplyNotifictionActionInput } from '@/graphql/helpers/generated'
import itemStyles from '../NotificationItem.module.css'
import styles from './CommentReplyActionItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { NotificationNotMerged } from '@/features/notification/hooks/useNotificationMerge'
import { useEffect, useState } from 'react'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import Thumbnail from '@/components/Thumbnail'
import Link from 'next/link'
import VLink from '@/components/VLink'

const cx = bindClassNames({ ...styles, ...itemStyles })

type Props = {
  action: CommentReplyNotifictionActionInput
  onClickNotification: (notificationIds: string[]) => Promise<void>
} & NotificationNotMerged

function CommentReplyActionItem({ id, action, created_at, is_read, onClickNotification }: Props) {
  const [isRead, setRead] = useState<boolean>()
  const {
    actor_display_name,
    actor_username,
    actor_thumbnail,
    reply_comment_text,
    parent_comment_text,
    post_url_slug,
    post_writer_username,
  } = action

  const velogUrl = `/@${actor_username}/posts`
  const { time } = useTimeFormat(created_at)

  useEffect(() => {
    setRead(is_read)
  }, [is_read])

  const onClick = () => {
    onClickNotification([id])
    setRead(true)
  }

  return (
    <div className={cx('block', 'item', { isRead })} onClick={onClick}>
      <Link href={velogUrl}>
        <Thumbnail className={cx('thumbnail')} src={actor_thumbnail} alt={actor_display_name} />
      </Link>
      <div className={cx('content')}>
        <p className={cx('wrap')}>
          <Link href={velogUrl}>
            <span className={cx('bold')}>{actor_display_name}</span>
          </Link>
          <span className={cx('spacer')} />
          <span>님이</span>
          <span className={cx('spacer')} />
          <span className={cx('bold')}>
            <VLink href={`/@${post_writer_username}/${post_url_slug}`}>
              {parent_comment_text.length > 20
                ? `${parent_comment_text.slice(0, 20)}...`
                : parent_comment_text}
            </VLink>
          </span>
          <span className={cx('spacer')} />
          <span>에 대한 답글을 작성하였습니다:</span>
          <span className={cx('spacer')} />
          <span className={cx('comment')}>
            <VLink href={`/@${post_writer_username}/${post_url_slug}`}>
              {reply_comment_text.length > 100
                ? `${reply_comment_text.slice(0, 100)}...`
                : reply_comment_text}
            </VLink>
          </span>
          <span className={cx('time')}>{time}</span>
        </p>
      </div>
    </div>
  )
}

export default CommentReplyActionItem
