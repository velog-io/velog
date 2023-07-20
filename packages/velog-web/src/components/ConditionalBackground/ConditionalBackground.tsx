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
    () => ['/', '/recent', '/lists', '/trending'].some((path) => path.includes(pathname)),
    [pathname]
  )

  useEffect(() => {
    const body = document.body
    const classNameMap = {
      isGray: isGray,
      isWhite: !isGray,
    }

    Object.entries(classNameMap).forEach(([className, condition]) => {
      const classValue = cx(className)
      if (condition) {
        body.classList.add(classValue)
      } else {
        body.classList.remove(classValue)
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
