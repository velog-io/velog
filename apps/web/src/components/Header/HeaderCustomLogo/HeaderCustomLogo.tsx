import { UserLogo } from '@/state/header'
import styles from './HeaderCustomLogo.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Link from 'next/link'
import { VelogIcon } from '@/assets/icons/components'
import { Fira_Mono } from 'next/font/google'

const cx = bindClassNames(styles)

const firaMono = Fira_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
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
      <Link href={velogPath} className={cx('userLogo', firaMono.className)}>
        <span className={cx('ellipsis')}>{userLogo.title || `${username}.log`}</span>
      </Link>
    </div>
  )
}

export default HeaderCustomLogo
