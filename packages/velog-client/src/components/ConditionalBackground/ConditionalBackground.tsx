import { useMemo } from 'react'
import styles from './ConditionalBackground.module.css'
import { usePathname } from 'next/navigation'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = { children: React.ReactNode }

function ConditionalBackground({ children }: Props) {
  const pathname = usePathname()

  const isGray = useMemo(
    () =>
      ['/', '/recent', '/lists', '/trending'].some((path) =>
        path.includes(pathname)
      ),
    [pathname]
  )

  return (
    <div className={cx('block', isGray ? 'isGray' : 'isWhite')}>{children}</div>
  )
}

export default ConditionalBackground
