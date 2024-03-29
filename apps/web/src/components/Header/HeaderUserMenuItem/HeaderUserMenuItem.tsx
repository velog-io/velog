import React from 'react'
import styles from './HeaderUserMenuItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import VLink from '@/components/VLink/VLink'
import Link from 'next/link'

const cx = bindClassNames(styles)

type Props = {
  children: React.ReactNode
  to?: string
  onClick?: () => void
  isMigrated?: boolean
}

function HeaderUserMenuItem({ children, to, onClick, isMigrated = false }: Props) {
  const jsx = (
    <div className={cx('block')} onClick={onClick}>
      {children}
    </div>
  )
  const WrapperComponent = !to ? React.Fragment : isMigrated ? (Link as any) : VLink
  return React.createElement(
    WrapperComponent,
    !to ? null : { href: to, className: `${cx('link')}` },
    jsx,
  )
}

export default HeaderUserMenuItem
