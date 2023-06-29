import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './BasicLayout.module.css'
import Header from '@/components/Header/Header'
import loadUesr from '@/lib/loadUser'

const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
}

async function BasicLayout({ children }: Props) {
  const user = await loadUesr()
  return (
    <main className={cx('block')}>
      <Header user={user} />
      {children}
    </main>
  )
}

export default BasicLayout
