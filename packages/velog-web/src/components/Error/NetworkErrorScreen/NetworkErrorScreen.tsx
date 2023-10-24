import styles from './NetworkErrorScreen.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function NetworkErrorScreen({}: Props) {
  return <div className={cx('block')}></div>
}

export default NetworkErrorScreen
