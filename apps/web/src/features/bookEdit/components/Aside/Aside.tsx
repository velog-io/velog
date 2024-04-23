'use client'

import styles from './Aside.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
// import { Navbar } from '@packages/nextra-theme-docs'

const cx = bindClassNames(styles)

function Aside() {
  return <div className={cx('block')}>{/* <Navbar flatDirectories={}  /> */}</div>
}

export default Aside
