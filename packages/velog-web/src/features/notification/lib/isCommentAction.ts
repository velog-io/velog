import { CommentNotificationAction } from '@/graphql/helpers/generated'

export const isCommentAction = (args: any): args is CommentNotificationAction => {
  if (args.type === 'comment') return true
  return false
}
