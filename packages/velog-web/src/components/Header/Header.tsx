'use client'

import styles from './Header.module.css'
import RoundButton from '@/components/RoundButton'
import { useAuth } from '@/state/auth'
import { useModal } from '@/state/modal'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { MouseEvent, MouseEventHandler, useEffect, useRef } from 'react'
import useToggle from '@/hooks/useToggle'
import HeaderUserIcon from '@/components/Header/HeaderUserIcon'
import HeaderUserMenu from '@/components/Header/HeaderUserMenu'
import HeaderSkeleton from '@/components/Header/HeaderSkeleton'
import { useCurrentUserQuery, useNotificationCountQuery } from '@/graphql/helpers/generated'
import HeaderLogo from './HeaderLogo'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { getUsernameFromParams } from '@/lib/utils'
import { NotificationIcon, SearchIcon } from '@/assets/icons/components'
import VLink from '../VLink'
import HeaderIcon from './HeaderIcon'
import Link from 'next/link'

const cx = bindClassNames(styles)

type Props = {
  logo?: React.ReactNode
}

function Header({ logo }: Props) {
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const [userMenu, toggleUserMenu] = useToggle(false)
  const ref = useRef<HTMLDivElement>(null)
  const { actions } = useModal()
  const {
    actions: { update },
  } = useAuth()
  const { data, isLoading } = useCurrentUserQuery()

  const user = data?.currentUser ?? null
  const { data: notificationCountData } = useNotificationCountQuery({}, { enabled: !!user })

  useEffect(() => {
    update(user)
  }, [update, user])

  const username = getUsernameFromParams(params)
  const urlForSearch = username ? `/search?username=${username}` : '/search'
  const isNotificationPage = pathname.includes('/notification')
  const notificationCount = notificationCountData?.notificationCount ?? 0

  const onClickNotification = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (!user) {
      actions.showModal('login', '/notifications')
      return
    }
    router.push('/notifications')
  }

  if (isLoading) return <HeaderSkeleton logo={logo || <HeaderLogo />} />
  return (
    <header className={cx('block', 'mainHeaderResponsive')}>
      <div className={cx('innerBlock')}>
        {logo || <HeaderLogo />}
        <div className={cx('right')}>
          <Link className={cx('notification')} href="/notifications" onClick={onClickNotification}>
            <HeaderIcon className={cx({ isNotificationPage })}>
              {user && notificationCount !== 0 && (
                <div
                  className={cx('notificationCounter', {
                    isSingle: Math.floor(notificationCount / 10) === 0,
                  })}
                >
                  {Math.min(99, notificationCount)}
                </div>
              )}
              <NotificationIcon />
            </HeaderIcon>
          </Link>
          <VLink href={urlForSearch}>
            <HeaderIcon>
              <SearchIcon />
            </HeaderIcon>
          </VLink>
          {user && (
            <>
              <RoundButton
                color="darkGray"
                border={true}
                to="/write"
                className={cx('writeButton', 'button')}
              >
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
              className={cx('button')}
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
