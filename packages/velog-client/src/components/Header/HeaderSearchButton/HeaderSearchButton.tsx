import { SearchIcon2 } from '@/public/svg'
import styles from './HeaderSearchButton.module.css'
import Link from 'next/link'

type Props = {
  to: string
}

function HeaderSearchButton({ to }: Props) {
  return (
    <Link href={to} className={styles.block}>
      <SearchIcon2 />
    </Link>
  )
}

export default HeaderSearchButton
