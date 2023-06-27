'use client'

import HeaderLogo from '@/components/Header/HeaderLogo'
import styles from './Header.module.css'
import RoundButton from '@/components/RoundButton/'
import { useAuth } from '@/state/auth'
import { useTheme } from '@/state/theme'
import HeaderSearchButton from '@/components/Header/HeaderSearchButton'
import ThemeToggleButton from '@/components/Header/ThemeToggleButton'
import AuthModal from '@/components/AuthModal/AuthModal'
import { useState } from 'react'
import { useModal } from '@/state/modal'

interface Props {}

function Header({}: Props) {
  const {
    value: { user },
  } = useAuth()
  const {
    value: { systemTheme },
  } = useTheme()
  const { actions } = useModal()
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
              <RoundButton
                color="darkGray"
                border={false}
                onClick={() => {
                  actions.showModal('login')
                }}
              >
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
