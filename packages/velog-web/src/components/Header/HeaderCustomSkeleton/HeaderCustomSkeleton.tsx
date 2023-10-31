import Link from 'next/link'
import styles from './HeaderCustomSkeleton.module.css'
import logoStyles from '../HeaderCustomLogo/HeaderCustomLogo.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { VelogIcon } from '@/assets/icons/components'

const cx = bindClassNames(styles)
const logoCx = bindClassNames(logoStyles)

type Props = {}

function HeaderCustomSkeleton({}: Props) {
  return (
    <div className={cx('block')}>
      <div className={cx('innerBlock')}>
        <div className={logoCx('block')}>
          <Link href="/" className={logoCx('logo')}>
            <VelogIcon />
          </Link>
        </div>
        <div className={cx('right')}>
          <div className={cx('button')} />
          <div className={cx('button')} />
          <div className={cx('button', 'writeButton')} />
          <div className={cx('button')} />
        </div>
      </div>
    </div>
  )
}

export default HeaderCustomSkeleton
