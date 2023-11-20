import styles from './VelogFollowList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function VelogFollowList({}: Props) {
  return <div className={cx('block')}></div>
}

export default VelogFollowList
