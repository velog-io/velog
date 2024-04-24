import { useInternals } from '@packages/nextra-theme-docs'
import styles from './NextraLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function NextraLayout({ children }: Props) {
  console.log('useInternals', useInternals)

  return (
    <div className={cx('block')}>
      Nextral
      {children}
    </div>
  )
}

export default NextraLayout
