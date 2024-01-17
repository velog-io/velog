import { Notification } from '@/graphql/helpers/generated'
import { useMemo } from 'react'

export default function useNotificationMerge(notifications: NotificationQueryData[] = []) {
  const generateKey = (notification: Partial<Notification>) =>
    `${notification.type}_${notification.action_target_id}`

  const mergeByTargetId = useMemo(
    () =>
      notifications.reduce<Map<string, Notification[]>>((map, notification) => {
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
      }, new Map()),
    [notifications],
  )

  const mapperKeys = Array.from(mergeByTargetId.keys())
  const usedMap = mapperKeys.reduce<Map<string, boolean>>(
    (acc, cur) => acc.set(cur, false),
    new Map(),
  )

  const merged = useMemo(
    () =>
      notifications
        .map((notification) => {
          if (notification.type === 'follower')
            return {
              ...notification,
              displayNames: [],
              actionCount: 0,
              isMerged: false,
            }
          const key = generateKey(notification)

          const isMerged = mapperKeys.includes(key)

          if (!isMerged)
            return { ...notification, displayNames: [], actionCount: 0, isMerged: false }

          const isUsed = usedMap.get(key)

          if (isUsed) return null

          const mergedData = mergeByTargetId.get(key)

          if (!mergedData) return null
          const displayNames = mergedData
            .map((data) => data.action.display_name as string)
            .slice(0, 2)
          const actionCount = mergedData.length

          usedMap.set(key, true)

          return {
            ...notification,
            displayNames,
            actionCount,
            isMerged: true,
          }
        })
        .filter(Boolean),
    [mapperKeys, mergeByTargetId, notifications, usedMap],
  ) as NotificationMergedType[]

  return { merged }
}

export type NotificationMergedType = {
  displayNames: string[]
  actionCount: number
  isMerged: boolean
} & Notification

type NotificationQueryData = Omit<Notification, 'fk_user_id' | 'is_deleted'>
