import useOutsideClick from '@/hooks/useOutsideClick'
import styles from './HomeMoreButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useTheme } from '@/state/theme'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const cx = bindClassNames(styles)

type Props = {
  isVisible: boolean
  onClose: () => void
}

function HomeMoreButton({ isVisible, onClose }: Props) {
  const { ref } = useOutsideClick<HTMLDivElement>(onClose)
  const {
    value: { theme },
  } = useTheme()
  const img =
    theme === 'dark' ? 'https://graphcdn.io/badge-light.svg' : 'https://graphcdn.io/badge.svg'

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
              <li>
                <Link href="/@velog">공지사항</Link>
              </li>
              <li>
                <Link href="/tags">태그 목록</Link>
              </li>
              <li>
                <Link href="/policy/terms">서비스 정책</Link>
              </li>
              <li>
                <a href="https://bit.ly/velog-slack" target="_blank" rel="noopener noreferrer">
                  Slack
                </a>
              </li>
            </ul>
            <div className={cx('contact')}>
              <h5>문의</h5>
              <div className={cx('email')}>contact@velog.io</div>
            </div>
            <div className={cx('graphCdn')}>
              <a href="https://graphcdn.io/?ref=powered-by">
                <Image
                  src={img}
                  alt="Powered by GraphCDN, the GraphQL CDN"
                  height={53}
                  width={120}
                />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default HomeMoreButton
