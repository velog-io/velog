import Image from 'next/image'
import styles from './HeaderLogo.module.css'
import { Logo } from '../../../../public/svg'

type Props = {}

function HeaderLogo({}: Props) {
  return (
    <div className={styles.block}>
      <Image src={Logo} alt="logo" />
    </div>
  )
}

export default HeaderLogo
