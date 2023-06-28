import styles from './HeaderUserMenuItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function HeaderUserMenuItem({}: Props) {
  return <div className={cx('block')}></div>
}

export default HeaderUserMenuItem
