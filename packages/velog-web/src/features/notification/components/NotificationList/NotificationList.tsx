'use client'

import { useSuspenseNotificationQuery } from '@/graphql/helpers/generated'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useNotificationMerge from '../../hooks/useNotificationMerge'
import { isCommentAction, isFollowerAction, isPostLikeAction } from '../../utils/notificationAction'
import CommentActionItem from '../NotificationItem/CommentActionItem'
import PostLikeActionItem from '../NotificationItem/PostLikeActionItem'
import FollowerActionItem from '../NotificationItem/FollowerActionItem'

const cx = bindClassNames(styles)

function NotificationList() {
  const { data } = useSuspenseNotificationQuery()
  const { merged } = useNotificationMerge(data?.notifications)

  const commentActions = merged
    .filter(isCommentAction)
    .map((notification) => <CommentActionItem key={notification.id} {...notification} />)
  const postLikeActions = merged
    .filter(isPostLikeAction)
    .map((notification) => <PostLikeActionItem key={notification.id} {...notification} />)
  const followerActions = merged
    .filter(isFollowerAction)
    .map((notification) => <FollowerActionItem key={notification.id} {...notification} />)

  const dateToTime = (date: string) => new Date(date).getTime()

  const result = [...commentActions, ...followerActions, ...postLikeActions].sort(
    (a, b) => dateToTime(b.props.created_at) - dateToTime(a.props.created_at),
  )

  return <ul className={cx('block')}>{result}</ul>
}

export default NotificationList
