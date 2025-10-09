'use client'

import { useParams, usePathname } from 'next/navigation'
import styles from './HomeTab.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useToggle from '@/hooks/useToggle'
import { useRef } from 'react'
import { useTimeframeValue } from '@/features/home/state/timeframe'
import ActiveLink from '@/components/ActiveLink/ActiveLink'
import { MdAccessTime, MdArrowDropDown, MdMoreVert, MdTrendingUp, MdRssFeed } from 'react-icons/md'
import { motion } from 'framer-motion'
import { timeframes } from '@/features/home/utils/timeframeMap'
import TimeframePicker from '@/features/home/components/TimeframePicker'
import HomeMoreButton from '@/features/home/components/HomeMoreButton'
import { CardsStarIcon } from '@/assets/icons/components'

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
  const isFeed = pathname === '/feed'
  const isCurated = pathname === '/curated'

  // Calculate indicator position based on active tab
  const getIndicatorStyle = () => {
    let position = 0
    if (isCurated) position = 1
    else if (isRecent) position = 2
    else if (isFeed) position = 3

    return {
      '--tab-index': position
    } as React.CSSProperties
  }

  const handleToggle = () => {
    if (isFetching) return
    toggleTimeframePicker()
  }

  return (
    <div className={cx('wrapper', 'mainHeaderResponsive', { isFloating: isFloatingHeader })}>
      <nav className={cx('left')}>
        <div className={cx('tab')} style={getIndicatorStyle()}>
          <ActiveLink
            href="/trending/week"
            className={cx({
              active: pathname === '/' || pathname.includes('/trending'),
            })}
          >
            <MdTrendingUp />
            <span>트렌딩</span>
          </ActiveLink>
          <ActiveLink href="/curated" className={cx({ active: pathname.includes('/curated') })}>
            <CardsStarIcon className={cx('icon')} />
            <span>추천</span>
          </ActiveLink>
          <ActiveLink href="/recent" className={cx({ active: pathname.includes('/recent') })}>
            <MdAccessTime />
            <span>최신</span>
          </ActiveLink>
          <ActiveLink href="/feed" className={cx({ active: pathname.includes('/feed') })}>
            <MdRssFeed />
            <span>피드</span>
          </ActiveLink>
          <motion.div
            initial={false}
            className={cx('indicator')}
          />
        </div>
      </nav>
      <div className={cx('right')}>
        {(pathname === '/' || pathname.includes('/trending')) && (
          <>
            <div className={cx('selector')} onClick={handleToggle} ref={timeframeRef}>
              {timeframes.find((t) => t[0] === timeframe)![1]}
              <MdArrowDropDown />
            </div>
            <TimeframePicker isVisible={timeframePicker} onClose={toggleTimeframePicker} />
          </>
        )}
        <MdMoreVert onClick={toggleMoreButton} className={cx('extra')} />
        <HomeMoreButton isVisible={moreButton} onClose={toggleMoreButton} />
      </div>
    </div>
  )
}

export default HomeTab
