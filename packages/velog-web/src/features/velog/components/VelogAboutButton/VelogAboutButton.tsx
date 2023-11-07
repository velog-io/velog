import styles from './VelogAboutButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function VelogAboutButton({}: Props) {
  return <div className={cx('block')}></div>
}

export default VelogAboutButton
