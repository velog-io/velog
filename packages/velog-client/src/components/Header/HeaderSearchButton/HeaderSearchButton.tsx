import { SearchIcon2 } from '@/public/svg'
import styles from './HeaderSearchButton.module.css'
import Link from 'next/link'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  to: string
}

function HeaderSearchButton({ to }: Props) {
  return (
    <Link href={to} className={cx('block')}>
      <SearchIcon2 />
    </Link>
  )
}

export default HeaderSearchButton
