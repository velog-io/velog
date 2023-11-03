'use client'

import { useEffect, useMemo } from 'react'
import styles from './ConditionalBackground.module.css'
import { usePathname } from 'next/navigation'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = { children: React.ReactNode }

function ConditionalBackground({ children }: Props) {
  const pathname = usePathname()
  const isGray = useMemo(
    () =>
      pathname === '/' ||
      ['/recent', '/lists', '/trending'].some((path) => pathname.includes(path)),
    [pathname],
  )

  useEffect(() => {
    const body = document.body
    const html = document.querySelector('html')
    const classNameMap = {
      isGray: isGray,
      isWhite: !isGray,
    }

    Object.entries(classNameMap).forEach(([className, condition]) => {
      if (condition) {
        html?.classList.add(className)
        body.classList.add(cx(className))
      } else {
        html?.classList.remove(className)
        body.classList.remove(cx(className))
      }
    })
  }, [isGray])

  return (
    <div
      className={cx('block', {
        isGray: isGray,
        isWhite: !isGray,
      })}
    >
      {children}
    </div>
  )
}

export default ConditionalBackground
