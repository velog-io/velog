import styles from './MarkdownRender.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function MarkdownRender({}: Props) {
  return <div className={cx('block')}></div>
}

export default MarkdownRender
