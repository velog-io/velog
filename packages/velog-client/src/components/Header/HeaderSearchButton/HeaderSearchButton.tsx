import styles from './HeaderSearchButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import VLink from '@/components/VLink/VLink'
import { IconSearch2 } from '@/icons/svg'

const cx = bindClassNames(styles)

type Props = {
  to: string
}

function HeaderSearchButton({ to }: Props) {
  return (
    <VLink href={to} className={cx('block')}>
      <IconSearch2 />
    </VLink>
  )
}

export default HeaderSearchButton
