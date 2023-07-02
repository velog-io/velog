'use client'

import { usePathname } from 'next/navigation'
import styles from './HomeTab.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useToggle from '@/hooks/useToggle'
import { useRef } from 'react'
import { useTimeframe } from '@/features/home/state/timeframe'
import ActiveLink from '@/components/ActiveLink/ActiveLink'
import { MdAccessTime, MdTrendingUp } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'

const cx = bindClassNames(styles)

type Props = {}

function HomeTab({}: Props) {
  const pathname = usePathname()

  const [extra, toggle] = useToggle(false)
  const [timeframePicker, toggleTimeframePicker] = useToggle(false)
  const moreButtonRef = useRef<HTMLDivElement | null>(null)
  const timeframeRef = useRef<HTMLDivElement | null>(null)
  const {
    value: { timeframe },
    actions: { choose },
  } = useTimeframe()

  const isRecent = pathname === '/recent'

  return (
    <div className={cx('wrapper')}>
      <div className={cx('left')}>
        <div className={cx('block')}>
          <ActiveLink
            href="/"
            className={cx({
              active: pathname === '/' || pathname.includes('/trending'),
            })}
          >
            <MdTrendingUp />
            <span>트렌딩</span>
          </ActiveLink>
          <ActiveLink
            href="/recent"
            className={cx({ active: pathname.includes('/recent') })}
          >
            <MdAccessTime />
            <span>최신</span>
          </ActiveLink>
          <AnimatePresence initial={true} mode="popLayout">
            {isRecent ? (
              <motion.div
                key="recent"
                initial={{ left: '0%', opacity: 0 }}
                animate={{ left: '50%', opacity: 1 }}
                exit={{ left: '0%' }}
                transition={{ type: 'spring', bounce: 0.35 }}
                className={cx('indicator')}
              />
            ) : (
              <motion.div
                key="trending"
                initial={{ left: '50%', opacity: 0 }}
                animate={{ left: '0%', opacity: 1 }}
                exit={{ left: '50%' }}
                transition={{ type: 'spring', bounce: 0.35 }}
                className={cx('indicator')}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default HomeTab
