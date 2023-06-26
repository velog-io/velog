'use client'

import HeaderLogo from '@/components/Header/HeaderLogo'
import styles from './Header.module.css'
import RoundButton from '@/components/RoundButton/RoundButton'
import { useAuth } from '@/state/auth'
import HeaderSearchButton from '@/components/Header/HeaderSearchButton/HeaderSearchButton'
import { useTheme } from '@/state/theme'
import ThemeToggleButton from '@/components/Header/ThemeToggleButton/ThemeToggleButton'

interface Props {}

function Header({}: Props) {
  const {
    value: { user },
  } = useAuth()
  const {
    value: { systemTheme },
  } = useTheme()

  const themeReady = systemTheme !== 'not-ready'

  // const urlForSearch = customHeader.custom ? `/search?username=${customHeader.username}` : '/search'
  const urlForSearch = '/search'

  return (
    <div className={styles.block}>
      <div className={styles['inner-block']}>
        <HeaderLogo />
        <div className={styles.right}>
          {user ? (
            <RoundButton color="darkGray">로그인 됨</RoundButton>
          ) : (
            <>
              {themeReady && <ThemeToggleButton />}
              <HeaderSearchButton to={urlForSearch} />
              <RoundButton color="darkGray" border={false}>
                로그인
              </RoundButton>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
