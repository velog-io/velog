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
import { useEffect, useRef } from 'react'
import useToggle from '@/hooks/useToggle'
import HeaderUserIcon from '@/components/Header/HeaderUserIcon'
import HeaderUserMenu from '@/components/Header/HeaderUserMenu'
import { CurrentUser } from '@/types/user'

const cx = bindClassNames(styles)

type Props = {
  user: CurrentUser | null
}

function Header({ user }: Props) {
  const {
    value: { systemTheme },
  } = useTheme()
  const [userMenu, toggleUserMenu] = useToggle(false)
  const ref = useRef<HTMLDivElement>(null)
  const { actions } = useModal()
  const {
    actions: { update },
  } = useAuth()

  const themeReady = systemTheme !== 'not-ready'

  useEffect(() => {
    update(user)
  }, [user, update])

  // const urlForSearch = customHeader.custom ? `/search?username=${customHeader.username}` : '/search'
  const urlForSearch = '/search'

  return (
    <header className={cx('block')}>
      <div className={cx('innerBlock')}>
        <HeaderLogo />
        <div className={cx('right')}>
          {themeReady && <ThemeToggleButton />}
          <HeaderSearchButton to={urlForSearch} />
          {user ? (
            <>
              <Button
                color="darkGray"
                border={true}
                style={{ marginRight: '1.25rem' }}
                to="/write"
                className={cx('writeButton')}
              >
                새 글 작성
              </Button>
              <div ref={ref}>
                <HeaderUserIcon user={user} onClick={toggleUserMenu} />
              </div>
              <HeaderUserMenu onClose={toggleUserMenu} isVisible={userMenu} />
            </>
          ) : (
            <>
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
    </header>
  )
}

export default Header
