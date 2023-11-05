import styles from './VelogTagHorizontalList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function VelogTagHorizontalList({}: Props) {
  return <div className={cx('block')}></div>
}

export default VelogTagHorizontalList
