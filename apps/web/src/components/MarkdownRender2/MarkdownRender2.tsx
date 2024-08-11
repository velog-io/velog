'use client'

import styles from './MarkdownRender2.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function MarkdownRender2({}: Props) {
  return <div className={cx('block')}></div>
}

export default MarkdownRender2
