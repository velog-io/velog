import styles from './TrendingWriterCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function TrendingWriterCard({}: Props) {
  return <div className={cx('block')}></div>
}

export default TrendingWriterCard
