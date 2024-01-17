import { Notification } from '@/graphql/helpers/generated'

export default function useNotificationMerge(notifications: Partial<Notification>[] = []) {
  const generateKey = (notification: Partial<Notification>) =>
    `${notification.type}_${notification.action_target_id}`

  const mergeByTargetId = notifications.reduce<Map<string, Notification[]>>((map, notification) => {
    if (!notification.action_target_id) return map
    if (notification.type === 'follower') return map
    const key = generateKey(notification)
    if (map.has(key)) {
      const value = map.get(key)
      value?.push(notification as Notification)
    } else {
      map.set(key, [notification as Notification])
    }
    return map
  }, new Map())

  const mapperKeys = Array.from(mergeByTargetId.keys())
  const usedMap = mapperKeys.reduce<Map<string, boolean>>(
    (acc, cur) => acc.set(cur, false),
    new Map(),
  )

  const merged = notifications
    .map((notification) => {
      if (notification.type === 'follower') return notification
      const key = generateKey(notification)
      const isMerged = mapperKeys.includes(key)

      if (!isMerged) return { ...notification }

      const isUsed = usedMap.get(key)

      if (isUsed) return null

      const mergedData = mergeByTargetId.get(key)

      if (!mergedData) return null
      const displayNames = mergedData.map((data) => data.action.display_name).slice(0, 2)
      const actionCount = mergedData.length

      usedMap.set(key, true)

      return {
        ...notification,
        displayNames,
        actionCount,
        isMerged: true,
      }
    })
    .filter(Boolean)

  return { merged }
}

export type NotificationMergedType = {
  displayNames: string[]
  actionCount: number
  isMerged: boolean
} & Notification
