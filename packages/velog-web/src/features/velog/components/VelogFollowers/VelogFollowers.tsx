import useFollowers from '../../hooks/useFollowers'
import VelogFollowListSkeleton from '../VelogFollowList/VelogFollowListSkeleton'
import styles from './VelogFollowers.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  username: string
}

function VelogFollowers({ username }: Props) {
  const { followers, isInitLoading } = useFollowers(username)

  if (isInitLoading) return <VelogFollowListSkeleton />

  return <div className={cx('block')}></div>
}

export default VelogFollowers
