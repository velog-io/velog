import { ENV } from '@/env'
import styles from './VLink.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { HTMLProps } from 'react'

const cx = bindClassNames(styles)

type Props = {
  href: string
  className?: string
  children?: React.ReactNode
} & HTMLProps<HTMLAnchorElement>

function VLink({ href, children, className = '', onClick }: Props) {
  const url = `${ENV.clientV2Host}${href}`
  return (
    <a href={url} className={cx('block', className)} onClick={onClick}>
      {children}
    </a>
  )
}

export default VLink
