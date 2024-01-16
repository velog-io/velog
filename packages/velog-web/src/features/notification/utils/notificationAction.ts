import {
  CommentNotificationAction,
  FollowerNotificationAction,
  PostLikeNotificationAction,
} from '@/graphql/helpers/generated'

export const isFollowerAction = (args: any): args is FollowerNotificationAction => {
  if (args.type === 'follower') return true
  return false
}

export const isCommentAction = (args: any): args is CommentNotificationAction => {
  if (args.type === 'comment') return true
  return false
}

export const isPostLikeAction = (args: any): args is PostLikeNotificationAction => {
  if (args.type === 'postLike') return true
  return false
}
