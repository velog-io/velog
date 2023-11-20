'use client'

import useFollowings from '../../hooks/useFollowings'
import VelogFollowListSkeleton from '../VelogFollowList/VelogFollowListSkeleton'
import styles from './VelogFollowings.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  username: string
}

function VelogFollowings({ username }: Props) {
  const { followings, isInitLoading } = useFollowings(username)

  if (isInitLoading) return <VelogFollowListSkeleton />

  console.log('followings', followings)
  return <div className={cx('block')}>list</div>
}

export default VelogFollowings
