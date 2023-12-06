import styles from './TrendingWriterLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FloatingHeader from '@/features/home/components/FloatingHeader'
import Header from '@/components/Header'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function TrendingWriterLayout({ children }: Props) {
  return (
    <div className={cx('block')}>
      <FloatingHeader header={<Header />} />
      <div className={cx('mainResponsive')}>
        <div className={cx('innerBlock')}>
          <Header />
          <div className={cx('mainWrapper')}>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendingWriterLayout
