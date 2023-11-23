import styles from './TrendingWriterHeader.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function TrendingWriterHeader({}: Props) {
  return <h1 className={cx('block')}>벨로그 인기 작가</h1>
}

export default TrendingWriterHeader
