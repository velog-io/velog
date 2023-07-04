import { Metadata } from 'next'
import styles from './TrendingPosts.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

function TrendingPosts() {
  return <div className={cx('block')}>trendingPosts</div>
}

export default TrendingPosts
