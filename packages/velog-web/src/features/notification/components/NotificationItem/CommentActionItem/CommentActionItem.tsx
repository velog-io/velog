'use client'

import styles from './CommentActionItem.module.css'
import itemStyles from '../NotificationItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { CommentNotificationAction } from '@/graphql/helpers/generated'
import { NotificationNotMerged } from '@/features/notification/hooks/useNotificationMerge'
import Link from 'next/link'
import Thumbnail from '@/components/Thumbnail'
import { useTimeFormat } from '@/hooks/useTimeFormat'

const cx = bindClassNames({ ...styles, ...itemStyles })

type Props = {
  action: CommentNotificationAction
} & NotificationNotMerged

function CommentActionItem({ action, created_at }: Props) {
  const { post_title, comment_text, actor_display_name, actor_thumbnail, actor_username } = action

  const velogUrl = `/@${actor_username}/posts`
  const { time } = useTimeFormat(created_at)

  return (
    <li className={cx('block', 'item')}>
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
          <span className={cx('postTitle', 'bold')}>
            {post_title.length > 20 ? `${post_title.slice(0, 20)}...` : post_title}
          </span>
          <span className={cx('spacer')} />
          <span>
            포스트에 댓글을 작성하였습니다:
            <span className={cx('spacer')} />
          </span>
          <span className={cx('comment')}>
            {comment_text.length > 100 ? `${comment_text.slice(0, 100)}...` : comment_text}
          </span>
          <span className={cx('time')}>{time}</span>
        </p>
      </div>
    </li>
  )
}

export default CommentActionItem
