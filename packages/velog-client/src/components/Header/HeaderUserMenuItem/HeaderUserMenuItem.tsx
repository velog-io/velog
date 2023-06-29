import React from 'react'
import Link from 'next/link'
import styles from './HeaderUserMenuItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
  to?: string
  onClick?: () => void
}

function HeaderUserMenuItem({ children, to, onClick }: Props) {
  const jsx = (
    <div className={cx('block')} onClick={onClick}>
      {children}
    </div>
  )
  const WrapperComponent = to ? Link : React.Fragment
  return React.createElement(
    WrapperComponent,
    to ? { href: to, className: `${cx('link')}` } : null,
    jsx
  )
}

export default HeaderUserMenuItem
