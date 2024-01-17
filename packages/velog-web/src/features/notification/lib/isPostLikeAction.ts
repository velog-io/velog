import { PostLikeNotificationAction } from '@/graphql/helpers/generated'

export const isPostLikeAciton = (args: any): args is PostLikeNotificationAction => {
  if (args.type === 'postLike') return true
  return false
}
