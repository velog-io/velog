import {
  CommentNotificationActionInput,
  CommentReplyNotifictionActionInput,
  FollowNotificationActionInput,
  NotificationType,
  PostLikeNotificationActionInput,
} from '@/graphql/server/generated/server'
import { NotificationMerged, NotificationNotMerged } from '../hooks/useNotificationMerge'

export const isFollowAction = (
  args: any,
): args is NotificationNotMerged<FollowNotificationActionInput> => {
  if ((args.type as NotificationType) === 'follow') return true
  return false
}

export const isCommentAction = (
  args: any,
): args is NotificationNotMerged<CommentNotificationActionInput> => {
  if ((args.type as NotificationType) === 'comment') return true
  return false
}

export const isCommentReplyAction = (
  args: any,
): args is NotificationNotMerged<CommentReplyNotifictionActionInput> => {
  if ((args.type as NotificationType) === 'commentReply') return true
  return false
}

export const isPostLikeAction = (
  args: any,
): args is NotificationMerged<PostLikeNotificationActionInput> => {
  if ((args.type as NotificationType) === 'postLike') return true
  return false
}
