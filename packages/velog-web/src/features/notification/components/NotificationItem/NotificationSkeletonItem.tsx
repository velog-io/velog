'use client'

import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './NotificationItem.module.css'
import Skeleton from '@/components/Skeleton'
import SkeletonTexts from '@/components/Skeleton/SkeletonTexts'

const cx = bindClassNames(styles)

type Props = { index: number }

function NotificationSkeletonItem({ index = 0 }: Props) {
  return (
    <li className={cx('block', 'skeleton')}>
      <div>
        <Skeleton circle={true} width="56px" height="56px" />
      </div>
      <div className={cx('content')}>
        <div className={cx('username')}>
          <Skeleton width="80px" marginRight="5px" />
          <Skeleton width="60px" />
        </div>
        <div className={cx('info')}>
          <SkeletonTexts wordLengths={[2, 4, 9, 4, 7, 3]} useFlex={true} />
        </div>
      </div>
      {index % 3 === 0 && <div className={cx('button')} />}
    </li>
  )
}

export default NotificationSkeletonItem
