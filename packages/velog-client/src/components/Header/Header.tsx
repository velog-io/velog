import HeaderLogo from '@/components/Header/HeaderLogo'
import styles from './Header.module.css'

interface Props {}

function Header({}: Props) {
  return (
    <div className={styles.block}>
      <div className={styles['inner-block']}>
        <HeaderLogo />
      </div>
    </div>
  )
}

export default Header
