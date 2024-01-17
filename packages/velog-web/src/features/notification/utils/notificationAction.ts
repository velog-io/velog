import {
  CommentNotificationAction,
  FollowerNotificationAction,
  PostLikeNotificationAction,
} from '@/graphql/helpers/generated'
import { NotificationMergedType } from '../hooks/useNotificationMerge'

export const isFollowerAction = (
  args: any,
): args is NotificationByAction<FollowerNotificationAction> => {
  if (args.type === 'follower') return true
  return false
}

export const isCommentAction = (
  args: any,
): args is NotificationByAction<CommentNotificationAction> => {
  if (args.type === 'comment') return true
  return false
}

export const isPostLikeAction = (
  args: any,
): args is NotificationByAction<PostLikeNotificationAction> => {
  if (args.type === 'postLike') return true
  return false
}

type NotificationByAction<T> = { action: T } & NotificationMergedType
