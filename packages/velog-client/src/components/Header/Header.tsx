'use client'

import HeaderLogo from '@/components/Header/HeaderLogo'
import styles from './Header.module.css'
import Button from '@/components/Button'
import { useAuth } from '@/state/auth'
import { useTheme } from '@/state/theme'
import HeaderSearchButton from '@/components/Header/HeaderSearchButton'
import ThemeToggleButton from '@/components/Header/ThemeToggleButton'
import { useModal } from '@/state/modal'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { memo } from 'react'

const cx = bindClassNames(styles)

function Header() {
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
    <div className={cx('block')}>
      <div className={cx('inner-block')}>
        <HeaderLogo />
        <div className={cx('right')}>
          {user ? (
            <Button color="darkGray">로그인 됨</Button>
          ) : (
            <>
              {themeReady && <ThemeToggleButton />}
              <HeaderSearchButton to={urlForSearch} />
              <Button
                color="darkGray"
                border={false}
                onClick={() => {
                  actions.showModal('login')
                }}
              >
                로그인
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(Header)
