import React, { HTMLProps } from 'react'
import Link from 'next/link'
import VLink from '../VLink'

type Props = {
  children: React.ReactNode
  href: string
  isMigrated?: boolean
} & HTMLProps<HTMLAnchorElement>

function PlainLink({
  children,
  href,
  className,
  onClick,
  onMouseOver,
  onMouseEnter,
  isMigrated = false,
}: Props) {
  const jsx = <>{children}</>
  const WrapperComponent = isMigrated ? (Link as any) : VLink

  return React.createElement(
    WrapperComponent,
    { href, className, onClick, onMouseOver, onMouseEnter },
    jsx,
  )
}

export default PlainLink
