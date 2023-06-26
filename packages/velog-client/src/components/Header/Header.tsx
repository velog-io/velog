'use client'

import HeaderLogo from '@/components/Header/HeaderLogo'
import styles from './Header.module.css'
import RoundButton from '@/components/RoundButton/RoundButton'
import { useAuth } from '@/state/auth'
import HeaderSearchButton from '@/components/Header/HeaderSearchButton/HeaderSearchButton'

interface Props {}

function Header({}: Props) {
  const {
    value: { user },
  } = useAuth()

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
