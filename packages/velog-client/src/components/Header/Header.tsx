import HeaderLogo from '@/components/Header/HeaderLogo'
import styles from './Header.module.css'
import RoundButton from '@/components/RoundButton/RoundButton'
import { useAuth } from '@/state/auth'

interface Props {}

function Header({}: Props) {
  const {
    value: { user },
  } = useAuth()
  return (
    <div className={styles.block}>
      <div className={styles['inner-block']}>
        <HeaderLogo />
        <div>
          {user ? (
            <RoundButton color="darkGray">로그인 됨</RoundButton>
          ) : (
            <RoundButton color="darkGray" border={false}>
              로그인
            </RoundButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
