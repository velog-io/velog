'use client'

import { useParams, usePathname } from 'next/navigation'
import styles from './HomeTab.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useToggle from '@/hooks/useToggle'
import { useRef } from 'react'
import { useTimeframeValue } from '@/features/home/state/timeframe'
import ActiveLink from '@/components/ActiveLink/ActiveLink'
import { MdAccessTime, MdArrowDropDown, MdMoreVert, MdTrendingUp } from 'react-icons/md'
import { motion } from 'framer-motion'
import { timeframes } from '@/features/home/utils/timeframeMap'
import TimeframePicker from '@/features/home/components/TimeframePicker'
import HomeMoreButton from '@/features/home/components/HomeMoreButton'

const cx = bindClassNames(styles)

type Props = {
  isFloatingHeader?: boolean
}

function HomeTab({ isFloatingHeader = false }: Props) {
  const pathname = usePathname()
  const params = useParams()
  const timeframe = params.timeframe ?? 'week'

  const [moreButton, toggleMoreButton] = useToggle(false)
  const [timeframePicker, toggleTimeframePicker] = useToggle(false)
  const { isFetching } = useTimeframeValue()
  const timeframeRef = useRef<HTMLDivElement | null>(null)
  const isRecent = pathname === '/recent'

  const handleToggle = () => {
    if (isFetching) return
    toggleTimeframePicker()
  }

  return (
    <div className={cx('wrapper', { noMargin: isFloatingHeader })}>
      <div className={cx('left')}>
        <div className={cx('block')}>
          <ActiveLink
            href="/trending/week"
            className={cx({
              active: pathname === '/' || pathname.includes('/trending'),
            })}
          >
            <MdTrendingUp />
            <span>트렌딩</span>
          </ActiveLink>
          <ActiveLink href="/recent" className={cx({ active: pathname.includes('/recent') })}>
            <MdAccessTime />
            <span>최신</span>
          </ActiveLink>
          <motion.div
            initial={false}
            animate={{
              left: isRecent ? '50%' : '0%',
            }}
            className={cx('indicator')}
          />
        </div>
        {(pathname === '/' || pathname.includes('/trending')) && (
          <>
            <div className={cx('selector')} onClick={handleToggle} ref={timeframeRef}>
              {timeframes.find((t) => t[0] === timeframe)![1]}
              <MdArrowDropDown />
            </div>
            <TimeframePicker isVisible={timeframePicker} onClose={toggleTimeframePicker} />
          </>
        )}
      </div>
      <MdMoreVert onClick={toggleMoreButton} className={cx('extra')} />
      <HomeMoreButton isVisible={moreButton} onClose={toggleMoreButton} />
    </div>
  )
}

export default HomeTab
