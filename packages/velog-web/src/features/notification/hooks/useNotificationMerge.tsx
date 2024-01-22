import { Notification } from '@/graphql/helpers/generated'
import { useMemo } from 'react'

export default function useNotificationMerge(notifications: NotificationQueryData[] = []) {
  const generateKey = (notification: Partial<Notification>) =>
    `${notification.type}_${notification.action_target_id}`

  const merged = useMemo(() => {
    const targetIdMap = notifications.reduce<Map<string, NotificationQueryData[]>>(
      (map, notification) => {
        if (!notification.action_target_id) return map
        if (['follower', 'comment'].includes(notification.type)) return map
        const key = generateKey(notification)
        if (map.has(key)) {
          const value = map.get(key)
          value?.push(notification)
        } else {
          map.set(key, [notification])
        }
        return map
      },
      new Map(),
    )

    const targetId: string[] = []
    targetIdMap.forEach((value, key) => {
      if (value.length > 1) {
        targetId.push(key)
      }
    })

    const usedTargetIdMap = targetId.reduce<Map<string, boolean>>(
      (acc, cur) => acc.set(cur, false),
      new Map(),
    )

    const result = notifications
      .map((notification) => {
        if (['follower', 'comment'].includes(notification.type)) {
          return {
            ...notification,
            is_merged: false,
          }
        }

        const key = generateKey(notification)
        const isMerged = targetId.includes(key)
        if (!isMerged) {
          return {
            ...notification,
            is_merged: false,
          }
        }

        const isUsed = usedTargetIdMap.get(key)

        if (isUsed) return null

        const mergedData = targetIdMap.get(key)

        if (!mergedData) return null
        const actorInfo = mergedData.slice(0, 2).map((data) => ({
          display_name: data.action.actor_display_name,
          username: data.action.actor_username,
          thumbnail: data.action.actor_thumbnail,
        }))

        usedTargetIdMap.set(key, true)

        return {
          ...notification,
          actor_info: actorInfo,
          action_count: mergedData.length,
          is_merged: true,
        }
      })
      .filter(Boolean)

    return result
  }, [notifications])

  return { merged } as { merged: (NotificationMerged | NotificationNotMerged)[] }
}

export type NotificationMerged<T = Record<string, any>> = {
  actor_info: { display_name: string; username: string; thumbnail: string }[]
  action_count: number
  is_merged: true
  action: T
} & Notification

export type NotificationNotMerged<T = Record<string, any>> = {
  is_merged: false
  action: T
} & Notification

type NotificationQueryData = Omit<Notification, 'fk_user_id' | 'is_deleted'>
