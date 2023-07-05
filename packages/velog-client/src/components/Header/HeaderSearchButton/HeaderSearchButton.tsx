import styles from './HeaderSearchButton.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import XLink from '@/components/XLink/XLink'
import Image from 'next/image'

const cx = bindClassNames(styles)

type Props = {
  to: string
}

function HeaderSearchButton({ to }: Props) {
  return (
    <XLink href={to} className={cx('block')}>
      <Image
        src="/svg/icon-search-2.svg"
        alt="serarch-icon"
        width={18}
        height={18}
      />
    </XLink>
  )
}

export default HeaderSearchButton
