import styles from './HeaderLogo.module.css'
import { Logo as VelogIcon } from '@/public/svg'
import Link from 'next/link'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Image from 'next/image'

const cx = bindClassNames(styles)

type Props = {}

function HeaderLogo({}: Props) {
  return (
    <div className={cx('block')}>
      <Link href="/">
        <Image
          src="/svg/logo.svg"
          className={cx('velogLogo')}
          data-testid="velog-logo"
          priority={true}
          alt="logo"
          width={71}
          height={24}
        />
      </Link>
    </div>
  )
}

export default HeaderLogo
