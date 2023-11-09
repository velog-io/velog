import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './BasicLayout.module.css'
import Header from '@/components/Header/Header'
import HomeTab from '@/features/home/components/HomeTab/HomeTab'
import FloatingHeader from '@/features/home/components/FloatingHeader/FloatingHeader'

const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
}

async function BasicLayout({ children }: Props) {
  return (
    <div className={cx('block')}>
      <FloatingHeader header={<Header />} />
      <div className={cx('mainResponsive')}>
        <div className={cx('innerBlock')}>
          <Header />
          <HomeTab />
          <div className={cx('mainWrapper')}>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicLayout
