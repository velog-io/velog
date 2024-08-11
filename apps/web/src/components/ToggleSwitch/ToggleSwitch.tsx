'use client'

import styles from './ToggleSwitch.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const cx = bindClassNames(styles)

type Props = {
  name?: string
  value: boolean
  onChange: (params: { name: string; value: boolean }) => void
  className?: string
}

function ToggleSwitch({ value, name, onChange, className }: Props) {
  const [localValue, setLocalValue] = useState<boolean>()

  const onToggle = () => {
    onChange({
      name: name || '',
      value: !localValue,
    })
    setLocalValue((v) => !v)
  }

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 50,
  }

  return (
    <div className={cx('block', className)}>
      <div className={cx('switch', { isActive: localValue })} onClick={onToggle}>
        <motion.div className={cx('handle')} layout={true} initial={false} transition={spring} />
      </div>
    </div>
  )
}

export default ToggleSwitch
