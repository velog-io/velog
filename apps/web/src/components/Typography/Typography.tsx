import styles from './Typography.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function Typography({ children }: Props) {
  return <div className={cx('block')}>{children}</div>
}

export default Typography
