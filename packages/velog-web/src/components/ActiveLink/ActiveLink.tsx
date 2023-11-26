import Link, { LinkProps } from 'next/link'

type Props = {
  children: React.ReactNode
  className: string
} & LinkProps

function ActiveLink({ href, className = '', children, ...rest }: Props) {
  return (
    <Link href={href} className={className} {...rest} scroll={false}>
      {children}
    </Link>
  )
}

export default ActiveLink
