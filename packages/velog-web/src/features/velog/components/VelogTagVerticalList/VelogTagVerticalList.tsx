import styles from './VelogTagVerticalList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function VelogTagVerticalList({}: Props) {
  return <div className={cx('block')}></div>
}

export default VelogTagVerticalList
