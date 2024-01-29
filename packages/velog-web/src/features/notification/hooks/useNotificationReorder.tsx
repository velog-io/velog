import { useNotificationCountQuery, useReadNoticationMutation } from '@/graphql/helpers/generated'
import { MergedNotifications } from './useNotificationMerge'
import { isCommentAction, isFollowAction, isPostLikeAction } from '../utils/notificationAction'
import CommentActionItem from '../components/NotificationItem/CommentActionItem'
import PostLikeActionItem from '../components/NotificationItem/PostLikeActionItem'
import FollowActionItem from '../components/NotificationItem/FollowActionItem'
import { useCallback, useMemo } from 'react'

export default function useNotificationReorder(merged: MergedNotifications = []) {
  const { refetch } = useNotificationCountQuery({})
  const { mutateAsync: readNotificationMutateAsync } = useReadNoticationMutation()

  const onClickNotification = useCallback(
    async (notificationIds: string[]) => {
      try {
        await readNotificationMutateAsync({
          input: {
            notification_ids: notificationIds,
          },
        })
        refetch()
      } catch (error) {
        console.error('Error while updating notifications:', error)
      }
    },
    [readNotificationMutateAsync, refetch],
  )

  const jsx = useMemo(() => {
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
      .filter(isFollowAction)
      .map((notification) => (
        <FollowActionItem
          key={notification.id}
          onClickNotification={onClickNotification}
          {...notification}
        />
      ))

    const dateToTime = (date: string) => new Date(date).getTime()

    const reorder = [...commentActions, ...postLikeActions, ...followerActions].sort(
      (a, b) => dateToTime(b.props.created_at) - dateToTime(a.props.created_at),
    )

    return reorder
  }, [merged, onClickNotification])

  return { jsx }
}
