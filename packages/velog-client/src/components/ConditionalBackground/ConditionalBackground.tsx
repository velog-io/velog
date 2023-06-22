'use client'

import { useMemo } from 'react'
import styles from './ConditionalBackground.module.css'
import { usePathname } from 'next/navigation'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

interface Props {}

function ConditionalBackground({}: Props) {
  const pathname = usePathname()

  const isGray = useMemo(
    () => ['/', '/recent', '/lists'].some((path) => path.includes(pathname)),
    [pathname]
  )

  return <div className={cx(isGray ? 'isGray' : 'isWhite')}></div>
}

export default ConditionalBackground
