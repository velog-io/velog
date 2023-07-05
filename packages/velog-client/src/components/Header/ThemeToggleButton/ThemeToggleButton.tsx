import { useToggleTheme } from '@/components/Header/hooks/useToggleTheme'
import styles from './ThemeToggleButton.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Image from 'next/image'

const cx = bindClassNames(styles)

type Props = {}

function ThemeToggleButton({}: Props) {
  const { theme, toggle } = useToggleTheme()
  const isDark = theme === 'dark'

  return (
    <button className={cx('block')} onClick={toggle}>
      <AnimatePresence initial={false}>
        <div className={cx('positional')}>
          <div className={cx('svgWrapper')}>
            {isDark ? (
              <motion.div
                key="dark"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ reverse: true }}
              >
                <Image
                  src="/svg/icon-moon.svg"
                  alt="dark-theme"
                  width={24}
                  height={24}
                />
              </motion.div>
            ) : (
              <motion.div
                key="light"
                initial={{ scale: 1, rotate: 0, opacity: 1 }}
                animate={{ scale: 1, rotate: 90, opacity: 1 }}
                exit={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ reverse: true }}
              >
                <Image
                  src="/svg/icon-sun.svg"
                  alt="light-theme"
                  width={24}
                  height={24}
                />
              </motion.div>
            )}
          </div>
        </div>
      </AnimatePresence>
    </button>
  )
}

export default ThemeToggleButton
