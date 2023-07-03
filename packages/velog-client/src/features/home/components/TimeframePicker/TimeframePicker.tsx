import { useTimeframe } from '@/features/home/state/timeframe'
import styles from './TimeframePicker.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useOutsideClick from '@/hooks/useOutsideClick'
import Link from 'next/link'
import { timeframes } from '@/features/home/utils/timeframeMap'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const cx = bindClassNames(styles)

type Props = {
  isVisible: boolean
  onClose: () => void
}

function TimeframePicker({ isVisible, onClose }: Props) {
  const {
    value: { timeframe },
    actions,
  } = useTimeframe()

  const { ref } = useOutsideClick<HTMLDivElement>(onClose)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, transform: 'scale(0.8)' }}
          animate={{ opacity: 1, transform: 'scale(1)' }}
          exit={{ opacity: 0, transform: 'scale(0.8)' }}
          transition={{ type: 'tween', duration: 0.2 }}
          className={cx('aligner')}
        >
          <div className={cx('block')} ref={ref}>
            <ul>
              {timeframes.map(([value, text]) => (
                <li
                  key={value}
                  onClick={() => {
                    actions.choose(value)
                    onClose()
                  }}
                  className={cx({ active: value === timeframe })}
                >
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TimeframePicker
