'use client'

import { useSuspenseNotificationQuery } from '@/graphql/helpers/generated'
import styles from './NotificationList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useNotificationMerge from '../../hooks/useNotificationMerge'

const cx = bindClassNames(styles)

type Props = {}

function NotificationList({}: Props) {
  const { data } = useSuspenseNotificationQuery()
  const { merged } = useNotificationMerge(data?.notifications)

  return <ul className={cx('block')}></ul>
}

export default NotificationList
