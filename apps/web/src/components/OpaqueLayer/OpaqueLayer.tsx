'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './OpaqueLayer.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  isVisible: boolean
}

function OpaqueLayer({ isVisible }: Props) {
  const [animate, setAnimate] = useState(false)
  const timeoutId = useRef<NodeJS.Timeout | null>(null)
  const mounted = useRef(false)
  const [closed, setClosed] = useState(true)

  useEffect(() => {
    // scrollbar
    document.body.style.overflowY = isVisible ? 'hidden' : 'initial'

    // animate
    if (!mounted.current) {
      mounted.current = true
    } else {
      setAnimate(true)
      timeoutId.current = setTimeout(() => {
        setAnimate(false)
        if (!isVisible) {
          setClosed(true)
        }
      }, 250)
    }

    if (isVisible) {
      setClosed(false)
    }

    return () => {
      if (!timeoutId.current) return
      clearTimeout(timeoutId.current)
    }
  }, [isVisible])

  useEffect(() => {
    return () => {
      document.body.style.overflowY = 'initial'
    }
  }, [])

  if (!animate && !isVisible && closed) return null

  return <div className={cx('block', isVisible ? 'fadeIn' : 'fadeOut')}></div>
}

export default OpaqueLayer
