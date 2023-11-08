import { UserLogo } from '@/state/header'
import styles from './HeaderCustomLogo.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Link from 'next/link'
import { VelogIcon } from '@/assets/icons/components'
import { Fira_Mono } from 'next/font/google'

const cx = bindClassNames(styles)

const firaMono = Fira_Mono({
  weight: ['400', '500', '700'],
  preload: false,
  display: 'swap',
  variable: '--monospace',
})

type Props = {
  username: string | null
  userLogo: UserLogo | null
}

function HeaderCustomLogo({ username, userLogo }: Props) {
  if (!userLogo || !username) return <></>
  const velogPath = `/@${username}`
  return (
    <div className={cx('block')}>
      <Link href="/" className={cx('logo')}>
        <VelogIcon />
      </Link>
      <Link href={velogPath} className={cx('userLogo', 'ellipsis', firaMono.className)}>
        {userLogo.title || `${username}.log`}
      </Link>
    </div>
  )
}

export default HeaderCustomLogo
