import Link from 'next/link'
import { HTMLProps } from 'react'

type Props = {
  children: React.ReactNode
  href: string
} & HTMLProps<HTMLAnchorElement>

function PlainLink({ children, href, className, onClick, onMouseOver, onMouseEnter }: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </Link>
  )
}

export default PlainLink
