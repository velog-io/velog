import styles from './HeaderLogo.module.css'
import { Logo as VelogIcon } from '@/../public/svg'
import Link from 'next/link'

type Props = {}

function HeaderLogo({}: Props) {
  return (
    <div className={styles.block}>
      <Link href="/">
        <VelogIcon data-testid="velog-logo" className="velog-logo" priority="true" alt="logo" />
      </Link>
    </div>
  )
}

export default HeaderLogo
