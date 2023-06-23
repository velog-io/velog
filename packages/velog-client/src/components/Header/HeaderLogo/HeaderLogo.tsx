import Image from 'next/image'
import styles from './HeaderLogo.module.css'
import { Logo as VelogIcon } from '../../../../public/svg'
import Link from 'next/link'

type Props = {}

function HeaderLogo({}: Props) {
  return (
    <div className={styles.block}>
      <Link href="/">
        <Image src={VelogIcon} alt="logo" data-testid="velog-logo" className='velog-logo'/>
      </Link>
    </div>
  )
}

export default HeaderLogo
