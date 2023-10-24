import styles from './NotFoundError.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function NotFoundError({}: Props) {
  return <div className={cx('block')}></div>
}

export default NotFoundError
