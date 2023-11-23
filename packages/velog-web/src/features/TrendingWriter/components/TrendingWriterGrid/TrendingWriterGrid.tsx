import styles from './TrendingWriterGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function TrendingWriterGrid({}: Props) {
  return <div className={cx('block', 'trendingWriterGrid')}></div>
}

export default TrendingWriterGrid
