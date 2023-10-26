import Header from '@/components/Header'
import styles from './VelogPageLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FloatingHeader from '@/features/home/components/FloatingHeader'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function VelogPageLayout({ children }: Props) {
  return (
    <div className={cx('block')}>
      <FloatingHeader />
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

export default VelogPageLayout
