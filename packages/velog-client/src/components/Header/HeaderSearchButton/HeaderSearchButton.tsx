import styles from './HeaderSearchButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import VLink from '@/components/VLink/VLink'
import Image from 'next/image'

const cx = bindClassNames(styles)

type Props = {
  to: string
}

function HeaderSearchButton({ to }: Props) {
  return (
    <VLink href={to} className={cx('block')}>
      <Image
        src="/svg/icon-search-2.svg"
        alt="serarch-icon"
        width={18}
        height={18}
      />
    </VLink>
  )
}

export default HeaderSearchButton
