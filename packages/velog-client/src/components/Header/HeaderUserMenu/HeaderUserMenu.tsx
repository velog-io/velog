import useOutsideClick from '@/hooks/useOutsideClick'
import styles from './HeaderUserMenu.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import useUserAuth from '@/hooks/useUserAuth'

const cx = bindClassNames(styles)

type Props = {
  onClose(): void
  isVisible: boolean
}

function HeaderUserMenu({ isVisible, onClose }: Props) {
  const ref = useOutsideClick<HTMLDivElement>(onClose)

  const { logout } = useUserAuth()

  if (!isVisible) return null
  return (
    <div className={cx('block')} ref={ref}>
      <div className="menu-wrapper"></div>
    </div>
  )
}

export default HeaderUserMenu
