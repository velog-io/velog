import { FollowerNotificationAction } from '@/graphql/helpers/generated'

export const isFollowerAction = (args: any): args is FollowerNotificationAction => {
  if (args.type === 'follower') return true
  return false
}
