import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './BasicLayout.module.css'
import ConditionalBackground from '@/components/ConditionalBackground'

const cx = bindClassNames(styles)

interface Props {
  children?: React.ReactNode
}

function BasicLayout({ children }: Props) {
  return (
    <main className={cx('block')}>
      <ConditionalBackground />
      {children}
    </main>
  )
}

export default BasicLayout
