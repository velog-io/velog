import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './BasicLayout.module.css'
import Header from '@/components/Header/Header'
import loadUser from '@/lib/loadUser'
import HomeTab from '@/features/home/components/HomeTab/HomeTab'

const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
}

async function BasicLayout({ children }: Props) {
  const user = await loadUser()
  return (
    <main className={cx('block')}>
      <Header user={user} />
      <HomeTab />
      {children}
    </main>
  )
}

export default BasicLayout
