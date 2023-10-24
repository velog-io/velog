import styles from './CrashErrorScreen.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function CrashErrorScreen({}: Props) {
  return <div className={cx('block')}></div>
}

export default CrashErrorScreen
