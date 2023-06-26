import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './BasicLayout.module.css'
import Header from '@/components/Header/Header'

const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
}

function BasicLayout({ children }: Props) {
  return (
    <main className={cx('block')}>
      <Header />
      {children}
    </main>
  )
}

export default BasicLayout
