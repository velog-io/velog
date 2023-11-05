import styles from './VelogTag.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function VelogTag({}: Props) {
  return <div className={cx('block')}></div>
}

export default VelogTag
