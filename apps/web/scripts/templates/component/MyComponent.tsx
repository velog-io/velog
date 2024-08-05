'use client'

import styles from './MyComponent.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function MyComponent({}: Props) {
  return <div className={cx('block')}></div>
}

export default MyComponent
