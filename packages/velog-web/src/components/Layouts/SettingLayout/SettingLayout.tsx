import styles from './SettingLayout.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
}

function SettingLayout({ children }: Props) {
  return <div className={cx('block')}>{children}</div>
}

export default SettingLayout
