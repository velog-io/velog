'use client'

import styles from './Aside.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { Navbar } from '@packages/nextra-theme-docs'
import { navbarFlatDirectories } from '../test/mock'

const cx = bindClassNames(styles)

function Aside() {
  return (
    <div className={cx('block')}>
      <div>books</div>
      <Navbar flatDirectories={navbarFlatDirectories} items={[]} />
    </div>
  )
}

export default Aside
