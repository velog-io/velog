import styles from './UserProfile.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function UserProfile({}: Props) {
  return <div className={cx('block')}></div>
}

export default UserProfile
