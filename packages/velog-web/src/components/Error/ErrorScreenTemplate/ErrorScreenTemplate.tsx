import styles from './ErrorScreenTemplate.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function ErrorScreenTemplate({}: Props) {
  return <div className={cx('block')}></div>
}

export default ErrorScreenTemplate
