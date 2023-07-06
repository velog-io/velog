import { useEffect, useMemo } from 'react'
import styles from './ConditionalBackground.module.css'
import { usePathname } from 'next/navigation'

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

  useEffect(() => {
    if (isGray) {
      document.body.classList.add(styles.isGray)
      document.body.classList.remove(styles.isWhite)
    } else {
      document.body.classList.remove(styles.isGray)
      document.body.classList.add(styles.isWhite)
    }
  }, [isGray])

  return <>{children}</>
}

export default ConditionalBackground
