import { SearchIcon2 } from '@/public/svg'
import styles from './HeaderSearchButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import XLink from '@/components/XLink/XLink'

const cx = bindClassNames(styles)

type Props = {
  to: string
}

function HeaderSearchButton({ to }: Props) {
  return (
    <XLink href={to} className={cx('block')}>
      <SearchIcon2 />
    </XLink>
  )
}

export default HeaderSearchButton
