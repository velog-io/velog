import styles from './VelogAboutEdit.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function VelogAboutEdit({}: Props) {
  return <div className={cx('block')}></div>
}

export default VelogAboutEdit
