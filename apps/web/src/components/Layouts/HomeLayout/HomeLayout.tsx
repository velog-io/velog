import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './HomeLayout.module.css'
import HomeTab from '@/features/home/components/HomeTab/HomeTab'
import FloatingHeader from '@/features/home/components/FloatingHeader/FloatingHeader'
import Header from '@/components/Header'
const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
  hideTab?: boolean
}

function HomeLayout({ children, hideTab = false }: Props) {
  return (
    <div className={cx('block')}>
      <FloatingHeader header={<Header />} />
      <div className={cx('mainResponsive')}>
        <div className={cx('innerBlock')}>
          <Header />
          {!hideTab && <HomeTab />}
          <div className={cx('mainWrapper')}>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeLayout
