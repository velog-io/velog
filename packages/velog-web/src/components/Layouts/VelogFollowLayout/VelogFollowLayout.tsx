import styles from './VelogFollowLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function VelogFollowLayout({}: Props) {
  return <div className={cx('block')}></div>
}

export default VelogFollowLayout
