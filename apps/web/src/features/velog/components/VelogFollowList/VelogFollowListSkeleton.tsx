'use client'

import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './VelogFollowList.module.css'
import { VelogFollowItemSkeleton } from '../VelogFollowItem'
const cx = bindClassNames(styles)

function VelogFollowListSkeleton() {
  return (
    <div className={cx('block')}>
      {Array.from({ length: 5 }).map((_, i) => (
        <VelogFollowItemSkeleton key={i} />
      ))}
    </div>
  )
}

export default VelogFollowListSkeleton
