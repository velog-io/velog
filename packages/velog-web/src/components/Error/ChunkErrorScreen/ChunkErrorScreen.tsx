import styles from './ChunkErrorScreen.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function ChunkErrorScreen({}: Props) {
  return <div className={cx('block')}></div>
}

export default ChunkErrorScreen
