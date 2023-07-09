import styles from './HeaderSearchButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import VLink from '@/components/VLink/VLink'
import { Search2Icon } from '@/assets/icons/components'

const cx = bindClassNames(styles)

type Props = {
  to: string
}

function HeaderSearchButton({ to }: Props) {
  return (
    <VLink href={to} className={cx('block')}>
      <Search2Icon />
    </VLink>
  )
}

export default HeaderSearchButton
