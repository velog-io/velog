import { UserLogo } from '@/state/header'
import styles from './HeaderCustomLogo.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Link from 'next/link'
import { VelogIcon } from '@/assets/icons/components'

const cx = bindClassNames(styles)

type Props = {
  isLoading: boolean
  username: string | null
  userLogo: UserLogo | null
}

function HeaderCustomLogo({ isLoading, username, userLogo }: Props) {
  if (isLoading) {
    return <div>loading</div>
  }

  if (!userLogo || !username) return <></>
  const velogPath = `/@${username}`
  return (
    <div className={cx('block')}>
      <Link href={velogPath}>
        <VelogIcon />
      </Link>
      <Link href={velogPath} className={cx('userLogo', 'ellipsis')}>
        {userLogo.title || `${username}.log`}
      </Link>
    </div>
  )
}

export default HeaderCustomLogo
