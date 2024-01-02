'use client'

import styles from './Header.module.css'
import RoundButton from '@/components/RoundButton'
import { useAuth } from '@/state/auth'
import HeaderSearchButton from '@/components/Header/HeaderSearchButton'
import { useModal } from '@/state/modal'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useEffect, useRef } from 'react'
import useToggle from '@/hooks/useToggle'
import HeaderUserIcon from '@/components/Header/HeaderUserIcon'
import HeaderUserMenu from '@/components/Header/HeaderUserMenu'
import HeaderSkeleton from '@/components/Header/HeaderSkeleton'
import { useCurrentUserQuery } from '@/graphql/helpers/generated'
import HeaderLogo from './HeaderLogo'
import { useParams } from 'next/navigation'
import { getUsernameFromParams } from '@/lib/utils'

const cx = bindClassNames(styles)

type Props = {
  logo?: React.ReactNode
}

function Header({ logo }: Props) {
  const params = useParams()
  const [userMenu, toggleUserMenu] = useToggle(false)
  const ref = useRef<HTMLDivElement>(null)
  const { actions } = useModal()
  const {
    actions: { update },
  } = useAuth()

  const { isLoading, data, isFetching } = useCurrentUserQuery()
  const user = data?.currentUser || null

  useEffect(() => {
    update(user)
  }, [update, user])

  const username = getUsernameFromParams(params)
  const urlForSearch = username ? `/search?username=${username}` : '/search'

  if (isLoading || isFetching) return <HeaderSkeleton logo={logo || <HeaderLogo />} />
  return (
    <header className={cx('block', 'mainHeaderResponsive')}>
      <div className={cx('innerBlock')}>
        {logo || <HeaderLogo />}
        <div className={cx('right')}>
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
