import React from 'react'
import styles from './HeaderUserMenuItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import VLink from '@/components/VLink/VLink'

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
  const WrapperComponent = to ? VLink : React.Fragment
  return React.createElement(
    WrapperComponent,
    to ? { href: to, className: `${cx('link')}` } : null,
    jsx,
  )
}

export default HeaderUserMenuItem
