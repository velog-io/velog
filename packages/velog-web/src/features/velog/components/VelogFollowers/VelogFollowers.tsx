'use client'

import useFollowers from '../../hooks/useFollowers'
import { VelogFollowList, VelogFollowListSkeleton } from '../VelogFollowList'
import styles from './VelogFollowers.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  username: string
}

function VelogFollowers({ username }: Props) {
  const { followers, isInitLoading } = useFollowers(username)

  if (isInitLoading) return <VelogFollowListSkeleton />
  console.log('followers', followers)
  return <VelogFollowList data={followers} />
}

export default VelogFollowers
