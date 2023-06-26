import { useToggleTheme } from '@/hooks/useToggleTheme'
import styles from './ThemeToggleButton.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { MoonIcon, SunIcon } from '@/../public/svg'

type Props = {}

function ThemeToggleButton({}: Props) {
  const [theme, toggle] = useToggleTheme()
  const isDark = theme === 'dark'

  return (
    <button className={styles.block} onClick={toggle}>
      <AnimatePresence initial={false}>
        {isDark ? (
          <div className={styles.positional}>
            <div className={styles['svg-wrapper']}>
              <motion.div
                key="dark"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ reverse: true }}
              >
                <MoonIcon />
              </motion.div>
            </div>
          </div>
        ) : (
          <div className={styles.positional}>
            <div className={styles['svg-wrapper']}>
              <motion.div
                key="light"
                initial={{ scale: 1, rotate: 0, opacity: 1 }}
                animate={{ scale: 1, rotate: -180, opacity: 1 }}
                exit={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ reverse: true }}
              >
                <SunIcon />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </button>
  )
}

export default ThemeToggleButton
