'use client'

import { useEffect, useState } from 'react'
import OpaqueLayer from '../OpaqueLayer'
import styles from './PopupBase.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  isVisible: boolean
  children: React.ReactNode
}

function PopupBase({ isVisible, children }: Props) {
  const [closed, setClosed] = useState(true)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    if (isVisible) {
      setClosed(false)
    } else {
      timeoutId = setTimeout(() => {
        setClosed(true)
      }, 200)
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isVisible])

  if (!isVisible && closed) return null

  return (
    <>
      <OpaqueLayer isVisible={isVisible} />
      <div className={cx('block')}>
        <div className={cx('wrapper', isVisible ? 'popInFromBottom' : 'popOutToBottom')}>
          {children}
        </div>
      </div>
    </>
  )
}

export default PopupBase
