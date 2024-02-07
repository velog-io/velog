'use client'

import Link from 'next/link'
import styles from './NotificationSelector.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { usePathname } from 'next/navigation'
import {
  useCurrentUserQuery,
  useNotNoticeNotificationCountQuery,
  useNotificationQuery,
  useReadAllNotificationsMutation,
  useRemoveAllNotificationsMutation,
} from '@/graphql/helpers/generated'
import PopupOKCancel from '@/components/PopupOKCancel'
import { useEffect, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { CurrentUser } from '@/types/user'

const cx = bindClassNames(styles)

function NotificationSelector() {
  const pathname = usePathname()
  const input: Record<string, any> = {}
  if (pathname.includes('/not-read')) {
    Object.assign(input, { is_read: false })
  }

  const [user, setUser] = useState<CurrentUser>()
  const { data } = useCurrentUserQuery()

  useEffect(() => {
    if (!data?.currentUser) return
    setUser(data.currentUser)
  }, [data])

  const [{ data: notificationQueryData, refetch }, { data: notificationCountData }] = useQueries({
    queries: [
      {
        queryKey: useNotificationQuery.getKey({ input }),
        queryFn: useNotificationQuery.fetcher({ input }),
        enabled: !user,
      },
      {
        queryKey: useNotNoticeNotificationCountQuery.getKey(),
        queryFn: useNotNoticeNotificationCountQuery.fetcher(),
        enabled: !user,
      },
    ],
  })

  const { mutateAsync: readAllMutateAsync } = useReadAllNotificationsMutation()
  const { mutateAsync: removeAllMutateAsync } = useRemoveAllNotificationsMutation()

  const [readAsk, setReadAsk] = useState(false)
  const [removeAsk, setRemoveAsk] = useState(false)

  const ask = (type: 'read' | 'remove') => {
    if (notificationQueryData?.notifications.length === 0) return

    if (type === 'read') {
      if (!notificationCountData || notificationCountData.notNoticeNotificationCount === 0) return
      setReadAsk(true)
    } else {
      setRemoveAsk(true)
    }
  }

  const onRead = async () => {
    await readAllMutateAsync({})
    setReadAsk(false)
    refetch()
  }

  const onRemove = async () => {
    await removeAllMutateAsync({})
    setRemoveAsk(false)
    refetch()
  }

  if (!user) return <div className={cx('loading')} />
  return (
    <div className={cx('block')}>
      <div className={cx('left')}>
        <Link
          href="/notifications"
          className={cx('button', { isActive: pathname === '/notifications' })}
        >
          전체
        </Link>
        <Link
          href="/notifications/not-read"
          className={cx('button', { isActive: pathname === '/notifications/not-read' })}
        >
          읽지 않음
        </Link>
      </div>
      <div className={cx('right')}>
        <div onClick={() => ask('read')} className={cx('handler')}>
          모두 읽음
        </div>
        <div onClick={() => ask('remove')} className={cx('handler')}>
          모두 삭제
        </div>
        <PopupOKCancel
          title="알림 읽음"
          isVisible={readAsk}
          onCancel={() => setReadAsk(false)}
          onConfirm={onRead}
        >
          모든 알림을 읽음 처리 하시겠습니까?
        </PopupOKCancel>
        <PopupOKCancel
          title="알림 삭제"
          isVisible={removeAsk}
          onCancel={() => setRemoveAsk(false)}
          onConfirm={onRemove}
        >
          모든 알림을 삭제 하시겠습니까?
        </PopupOKCancel>
      </div>
    </div>
  )
}

export default NotificationSelector
