'use client'

import {
  useReadNoticationMutation,
  useSuspenseNotificationQuery,
} from '@/graphql/helpers/generated'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useNotificationMerge from '../../hooks/useNotificationMerge'
import { isCommentAction, isFollowerAction, isPostLikeAction } from '../../utils/notificationAction'
import CommentActionItem from '../NotificationItem/CommentActionItem'
import PostLikeActionItem from '../NotificationItem/PostLikeActionItem'
import FollowerActionItem from '../NotificationItem/FollowerActionItem'
import { usePathname } from 'next/navigation'

const cx = bindClassNames(styles)

function NotificationList() {
  const pathname = usePathname()
  const input: Record<string, any> = {}
  if (pathname.includes('/not-read')) {
    Object.assign(input, { is_read: false })
  }

  const { data } = useSuspenseNotificationQuery({ input })
  const { merged } = useNotificationMerge(data?.notifications)
  const { mutateAsync: readNotificationMutateAsync } = useReadNoticationMutation()

  const onClickNotification = async (notificationIds: string[]) => {
    await readNotificationMutateAsync({
      input: {
        notification_ids: notificationIds,
      },
    })
  }

  const commentActions = merged
    .filter(isCommentAction)
    .map((notification) => (
      <CommentActionItem
        key={notification.id}
        onClickNotification={onClickNotification}
        {...notification}
      />
    ))
  const postLikeActions = merged
    .filter(isPostLikeAction)
    .map((notification) => (
      <PostLikeActionItem
        key={notification.id}
        onClickNotification={onClickNotification}
        {...notification}
      />
    ))
  const followerActions = merged
    .filter(isFollowerAction)
    .map((notification) => (
      <FollowerActionItem
        key={notification.id}
        onClickNotification={onClickNotification}
        {...notification}
      />
    ))

  const dateToTime = (date: string) => new Date(date).getTime()

  const result = [...commentActions, ...followerActions, ...postLikeActions].sort(
    (a, b) => dateToTime(b.props.created_at) - dateToTime(a.props.created_at),
  )

  return <ul className={cx('block')}>{result}</ul>
}

export default NotificationList
