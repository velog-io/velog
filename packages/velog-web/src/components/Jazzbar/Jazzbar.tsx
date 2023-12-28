'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import styles from './Jazzbar.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { sleep } from '@/lib/utils'
import JazzbarContext from '@/providers/JazzbarProvider'

const cx = bindClassNames(styles)

type Props = {}

function Jazzbar({}: Props) {
  const jazzbar = useContext(JazzbarContext)
  const [visible, setVisible] = useState(false)
  const [hiding, setHiding] = useState(false)
  const [zero, setZero] = useState(false)

  const { value, set } = jazzbar

  const hide = useCallback(() => {
    setHiding(true)
    const run = async () => {
      await sleep(200)
      setZero(true)
      await sleep(400)
      setHiding(false)
    }
    run()
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null
    if (!visible && ![0, 100].includes(value)) {
      setVisible(true)
    }
    if (value === 100) {
      timeout = setTimeout(hide, 400)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [hide, value, visible])

  useEffect(() => {
    if (zero) {
      setZero(false)
      set(0)
    }
  }, [set, zero])

  return <div className={cx('jazzbar', { hiding, zero })} style={{ width: `${value}%` }} />
}

export default Jazzbar
