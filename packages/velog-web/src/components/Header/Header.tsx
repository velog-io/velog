'use client'

import styles from './Header.module.css'
import RoundButton from '@/components/RoundButton'
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
import HeaderSkeleton from '@/components/Header/HeaderSkeleton'
import { useCurrentUserQuery } from '@/graphql/generated'
import HeaderLogo from './HeaderLogo'
import HeaderCustomSkeleton from './HeaderCustomSkeleton'

const cx = bindClassNames(styles)

type Props = {
  headerCustomLogo?: React.ReactNode
}

function Header({ headerCustomLogo }: Props) {
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

  const { isLoading, data } = useCurrentUserQuery()
  const user = data?.currentUser || null

  useEffect(() => {
    update(user)
  }, [update, user])

  // const urlForSearch = customHeader.custom ? `/search?username=${customHeader.username}` : '/search'
  const urlForSearch = '/search'

  if (isLoading && !headerCustomLogo) return <HeaderSkeleton />
  if (isLoading && headerCustomLogo) return <HeaderCustomSkeleton />
  return (
    <header className={cx('block')}>
      <div className={cx('innerBlock')}>
        {headerCustomLogo ? headerCustomLogo : <HeaderLogo />}
        <div className={cx('right')}>
          {themeReady && <ThemeToggleButton />}
          <HeaderSearchButton to={urlForSearch} />
          {user && (
            <>
              <RoundButton color="darkGray" border={true} to="/write" className={cx('writeButton')}>
                새 글 작성
              </RoundButton>
              <div ref={ref}>
                <HeaderUserIcon user={user} onClick={toggleUserMenu} />
              </div>
              <HeaderUserMenu onClose={toggleUserMenu} isVisible={userMenu} />
            </>
          )}
          {!user && (
            <RoundButton
              color="darkGray"
              border={false}
              onClick={() => {
                actions.showModal('login')
              }}
            >
              로그인
            </RoundButton>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
