import useOutsideClick from '@/hooks/useOutsideClick'
import styles from './HeaderUserMenu.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  onClose(): void
  isVisible: boolean
}

function HeaderUserMenu({ isVisible, onClose }: Props) {
  const ref = useOutsideClick<HTMLDivElement>(onClose)

  if (!isVisible) return null
  return (
    <div className={cx('block')} ref={ref}>
      <div className="menu-wrapper"></div>
    </div>
  )
}

export default HeaderUserMenu
