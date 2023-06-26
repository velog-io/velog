import { SearchIcon2 } from '@/../public/svg'
import styles from './HeaderSearchButton.module.css'
import Link from 'next/link'

type Props = {
  to: string
  isDark: boolean
}

function HeaderSearchButton({ to, isDark }: Props) {
  return (
    <Link href={to} className={styles.block}>
      <SearchIcon2 className={styles.svg} />
    </Link>
  )
}

export default HeaderSearchButton
