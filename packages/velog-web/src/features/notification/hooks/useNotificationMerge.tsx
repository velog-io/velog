import { Notification } from '@/graphql/helpers/generated'
import { useMemo } from 'react'

export default function useNotificationMerge(notifications: NotificationQueryData[] = []) {
  const generateKey = (notification: Partial<Notification>) =>
    `${notification.type}_${notification.action_target_id}`

  const merged = useMemo(() => {
    const targetIdMap = notifications.reduce<Map<string, Notification[]>>((map, notification) => {
      if (!notification.action_target_id) return map
      if (['follower', 'comment'].includes(notification.type)) return map
      const key = generateKey(notification)
      if (map.has(key)) {
        const value = map.get(key)
        value?.push(notification as Notification)
      } else {
        map.set(key, [notification as Notification])
      }
      return map
    }, new Map())

    const targetId = Array.from(targetIdMap.keys())
    const usedTargetIdMap = targetId.reduce<Map<string, boolean>>(
      (acc, cur) => acc.set(cur, false),
      new Map(),
    )

    const result = notifications
      .map((notification) => {
        if (['follower', 'comment'].includes(notification.type)) {
          return {
            ...notification,
            isMerged: false,
          }
        }

        const key = generateKey(notification)

        const isMerged = targetId.includes(key)

        if (!isMerged) {
          return {
            ...notification,
            isMerged: false,
          }
        }

        const isUsed = usedTargetIdMap.get(key)

        if (isUsed) return null

        const mergedData = targetIdMap.get(key)

        if (!mergedData) return null
        const displayNames = mergedData
          .slice(0, 2)
          .map((data) => data.action.display_name as string)
        const thumbnails = mergedData
          .slice(0, 2)
          .map((data) => data.action.thumbnail_name as string)

        const actionCount = mergedData.length

        usedTargetIdMap.set(key, true)

        return {
          ...notification,
          displayNames,
          thumbnails,
          actionCount,
          isMerged: true,
        }
      })
      .filter(Boolean)

    return result
  }, [notifications])

  return { merged }
}

export type NotificationMerged<T = Record<string, any>> = {
  displayNames: string[]
  actionCount: number
  isMerged: true
  thumbnails: string[]
  action: T
} & Notification

export type NotificationNotMerged<T = Record<string, any>> = {
  isMerged: false
  action: T
} & Notification

type NotificationQueryData = Omit<Notification, 'fk_user_id' | 'is_deleted'>
