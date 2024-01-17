'use client'

import { useSuspenseNotificationQuery } from '@/graphql/helpers/generated'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useNotificationMerge from '../../hooks/useNotificationMerge'
import { isCommentAction, isFollowerAction, isPostLikeAction } from '../../utils/notificationAction'
import CommentActionItem from '../NotificationItem/CommentActionItem'
import PostLikeActionItem from '../NotificationItem/PostLikeActionItem'
import FollowerActionItem from '../NotificationItem/FollowerActionItem'
import { useCallback, useMemo } from 'react'

const cx = bindClassNames(styles)

type Props = {}

function NotificationList({}: Props) {
  const { data } = useSuspenseNotificationQuery()
  const { merged } = useNotificationMerge(data?.notifications)

  const commentActions = useMemo(
    () =>
      merged
        .filter(isCommentAction)
        .map((notification) => (
          <CommentActionItem key={notification.id} className={cx('item')} {...notification} />
        )),
    [merged],
  )

  const postLikeActions = useMemo(
    () =>
      merged
        .filter(isPostLikeAction)
        .map((notification) => (
          <PostLikeActionItem key={notification.id} className={cx('item')} {...notification} />
        )),
    [merged],
  )

  const followerActions = useMemo(
    () =>
      merged
        .filter(isFollowerAction)
        .map((notification) => (
          <FollowerActionItem key={notification.id} className={cx('item')} {...notification} />
        )),
    [merged],
  )

  const dateToTime = (date: string) => new Date(date).getTime()

  const result = useMemo(
    () =>
      [...commentActions, ...followerActions, ...postLikeActions].sort(
        (a, b) => dateToTime(b.props.created_at) - dateToTime(a.props.created_at),
      ),
    [commentActions, postLikeActions, followerActions],
  )

  return <ul className={cx('block')}>{result}</ul>
}

export default NotificationList
