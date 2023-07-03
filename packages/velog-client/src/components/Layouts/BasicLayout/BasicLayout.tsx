import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './BasicLayout.module.css'
import Header from '@/components/Header/Header'
import getCurrentUser from '@/actions/getCurrentUser'
import HomeTab from '@/features/home/components/HomeTab/HomeTab'

const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
}

async function BasicLayout({ children }: Props) {
  const user = await getCurrentUser()
  return (
    <main className={cx('block')}>
      <Header user={user} />
      <HomeTab />
      {children}
    </main>
  )
}

export default BasicLayout
