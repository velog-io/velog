import { useNotificationQuery, useReadNoticationMutation } from '@/graphql/server/generated/server'
import { MergedNotifications } from './useNotificationMerge'
import {
  isCommentAction,
  isCommentReplyAction,
  isFollowAction,
  isPostLikeAction,
} from '../utils/notificationAction'
import CommentActionItem from '../components/NotificationItem/CommentActionItem'
import PostLikeActionItem from '../components/NotificationItem/PostLikeActionItem'
import FollowActionItem from '../components/NotificationItem/FollowActionItem'
import { useCallback, useMemo } from 'react'
import CommentReplyActionItem from '../components/NotificationItem/CommentReplyActionItem'
import { usePathname } from 'next/navigation'

export default function useNotificationToJSX(merged: MergedNotifications = []) {
  const pathname = usePathname()
  const input: Record<string, any> = {}
  if (pathname.includes('/not-read')) {
    Object.assign(input, { is_read: false })
  }

  const { refetch: notificationRefetch } = useNotificationQuery({ input })
  const { mutateAsync: readNotificationMutateAsync } = useReadNoticationMutation()

  const onClickNotification = useCallback(
    async (notificationIds: string[]) => {
      await readNotificationMutateAsync({
        input: {
          notification_ids: notificationIds,
        },
      })
      notificationRefetch()
    },
    [readNotificationMutateAsync, notificationRefetch],
  )

  const jsx = useMemo(() => {
    const commentActions = merged
      .filter(isCommentAction)
      .map((notification) => (
        <CommentActionItem
          {...notification}
          key={notification.id}
          onClickNotification={onClickNotification}
        />
      ))

    const commentReplyActions = merged
      .filter(isCommentReplyAction)
      .map((notification) => (
        <CommentReplyActionItem
          {...notification}
          key={notification.id}
          onClickNotification={onClickNotification}
        />
      ))

    const postLikeActions = merged
      .filter(isPostLikeAction)
      .map((notification) => (
        <PostLikeActionItem
          {...notification}
          key={notification.id}
          onClickNotification={onClickNotification}
        />
      ))

    const followerActions = merged
      .filter(isFollowAction)
      .map((notification) => (
        <FollowActionItem
          key={notification.id}
          onClickNotification={onClickNotification}
          {...notification}
        />
      ))

    const dateToTime = (date: string) => new Date(date).getTime()

    const reorder = [
      ...commentActions,
      ...commentReplyActions,
      ...postLikeActions,
      ...followerActions,
    ].sort((a, b) => dateToTime(b.props.created_at) - dateToTime(a.props.created_at))

    return reorder
  }, [merged, onClickNotification])

  return { jsx }
}
