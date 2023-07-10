import styles from './HeaderLogo.module.css'
import { Logo as VelogIcon } from '@/assets/icons/components'
import Link from 'next/link'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {}

function HeaderLogo({}: Props) {
  return (
    <div className={cx('block')}>
      <Link href="/">
        <VelogIcon
          className={cx('velogLogo')}
          data-testid="velog-logo"
          width={71}
          height={24}
        />
      </Link>
    </div>
  )
}

export default HeaderLogo
