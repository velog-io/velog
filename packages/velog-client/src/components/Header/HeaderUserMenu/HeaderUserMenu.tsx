import useOutsideClick from '@/hooks/useOutsideClick'
import styles from './HeaderUserMenu.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import HeaderUserMenuItem from '@/components/Header/HeaderUserMenuItem/HeaderUserMenuItem'
import { useAuth } from '@/state/auth'

const cx = bindClassNames(styles)

type Props = {
  onClose(): void
  isVisible: boolean
}

function HeaderUserMenu({ isVisible, onClose }: Props) {
  const {
    value: { user },
  } = useAuth()
  const ref = useOutsideClick<HTMLDivElement>(onClose)

  if (!isVisible) return null
  return (
    <div className={cx('block')} ref={ref}>
      <div className={cx('menu-wrapper')}>
        <HeaderUserMenuItem to={`/@${user?.username}`}>
          내 벨로그
        </HeaderUserMenuItem>
        <div className={cx('mobile-only')}>
          <HeaderUserMenuItem to="/write">새 글 작성</HeaderUserMenuItem>
        </div>
        <HeaderUserMenuItem to="/saves">임시 글</HeaderUserMenuItem>
        <HeaderUserMenuItem to="/lists/liked">읽기 목록</HeaderUserMenuItem>
        <HeaderUserMenuItem to="/setting">설정</HeaderUserMenuItem>
        {/* <HeaderUserMenuItem onClick={onLogout}>로그아웃</HeaderUserMenuItem> */}
      </div>
    </div>
  )
}

export default HeaderUserMenu
