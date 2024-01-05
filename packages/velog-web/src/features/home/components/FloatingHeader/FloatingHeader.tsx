'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './FloatingHeader.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { getScrollTop } from '@/lib/utils'
import HomeTab from '@/features/home/components/HomeTab/HomeTab'
import { usePathname } from 'next/navigation'
import { checkIsHome } from '@/lib/checkIsHome'

const cx = bindClassNames(styles)

type Props = {
  header: React.ReactNode
}

function FloatingHeader({ header }: Props) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const blockRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [marginTop, setMarginTop] = useState(0)

  useEffect(() => {
    if (!blockRef.current) return
    setHeight(blockRef.current.clientHeight)
    setMarginTop(-1 * blockRef.current.clientHeight)
  }, [])

  const prevScrollTop = useRef(0)
  const direction = useRef<'UP' | 'DOWN'>('DOWN')
  const transitionPoint = useRef(0)

  const onScroll = useCallback(() => {
    const scrollTop = getScrollTop()
    const nextDirection = prevScrollTop.current > scrollTop ? 'UP' : 'DOWN'

    if (
      direction.current === 'DOWN' &&
      nextDirection === 'UP' &&
      transitionPoint.current - scrollTop < 0
    ) {
      setVisible(true)
      transitionPoint.current = scrollTop
    }

    if (
      direction.current === 'UP' &&
      nextDirection === 'DOWN' &&
      scrollTop - transitionPoint.current < -1 * height
    ) {
      transitionPoint.current = scrollTop + height
    }

    if (scrollTop < 64) {
      setVisible(false)
    }

    setMarginTop(Math.min(0, -1 * height + transitionPoint.current - scrollTop))

    direction.current = nextDirection
    prevScrollTop.current = scrollTop
  }, [height])

  useEffect(() => {
    document.addEventListener('scroll', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [onScroll])

  const isHome = checkIsHome(pathname)
  return (
    <div
      className={cx('block')}
      style={
        visible
          ? {
              marginTop: marginTop,
              display: 'block',
            }
          : {
              marginTop: -1 * height,
              opacity: 0,
            }
      }
      ref={blockRef}
    >
      <div className={cx('mainResponsive')}>
        {header}
        {isHome && <HomeTab isFloatingHeader={true} />}
      </div>
    </div>
  )
}

export default FloatingHeader
