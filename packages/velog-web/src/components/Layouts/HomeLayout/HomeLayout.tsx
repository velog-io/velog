import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './HomeLayout.module.css'
import HomeTab from '@/features/home/components/HomeTab/HomeTab'
import FloatingHeader from '@/features/home/components/FloatingHeader/FloatingHeader'
import Header from '@/components/Header'
import getNotificationCount from '@/prefetch/getNotificationCount'
const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
}

async function HomeLayout({ children }: Props) {
  const notificationCount = await getNotificationCount()
  return (
    <div className={cx('block')}>
      <FloatingHeader header={<Header notificationCount={notificationCount} />} />
      <div className={cx('mainResponsive')}>
        <div className={cx('innerBlock')}>
          <Header notificationCount={notificationCount} />
          <HomeTab />
          <div className={cx('mainWrapper')}>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeLayout
