import styles from './Aside.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

function Aside() {
  return (
    <div className={cx('block')}>
      <div>books</div>
    </div>
  )
}

export default Aside
