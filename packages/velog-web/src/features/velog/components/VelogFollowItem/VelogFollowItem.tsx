import styles from './VelogFollowItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function VelogFollowItem({}: Props) {
  return <div className={cx('block')}></div>
}

export default VelogFollowItem
