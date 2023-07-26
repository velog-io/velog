import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './BasicLayout.module.css'
import Header from '@/components/Header/Header'
import HomeTab from '@/features/home/components/HomeTab/HomeTab'
import { Suspense } from 'react'

const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
}

async function BasicLayout({ children }: Props) {
  return (
    <div className={cx('block')}>
      <Header />
      <Suspense>
        <HomeTab />
      </Suspense>
      <div className={cx('mainWrapper')}>
        <main>{children}</main>
      </div>
    </div>
  )
}

export default BasicLayout
