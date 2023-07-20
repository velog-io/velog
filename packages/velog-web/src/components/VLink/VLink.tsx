import { ENV } from '@/env'
import styles from './VLink.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  href: string
  className?: string
  children?: React.ReactNode
}

function VLink({ href, children, className = '' }: Props) {
  const url = `${ENV.clientV2Host}${href}`
  return (
    <a href={url} className={cx('block', className)}>
      {children}
    </a>
  )
}

export default VLink
