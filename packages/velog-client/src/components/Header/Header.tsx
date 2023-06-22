import HeaderLogo from '@/components/Header/HeaderLogo'
import styles from './Header.module.css'

interface Props {}

function Header({}: Props) {
  return (
    <div className={styles.block}>
      <HeaderLogo />
    </div>
  )
}

export default Header
