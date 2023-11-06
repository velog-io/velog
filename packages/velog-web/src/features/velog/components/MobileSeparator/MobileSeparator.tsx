import styles from './MobileSeparator.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function MobileSeparator({}: Props) {
  return <div className={cx('block')} />
}

export default MobileSeparator
