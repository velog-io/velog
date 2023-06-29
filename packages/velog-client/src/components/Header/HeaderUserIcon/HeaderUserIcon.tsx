import { CurrentUser } from '@/types/user'
import styles from './HeaderUserIcon.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Image from 'next/image'
import { userThumbnail } from '@/public/images'
import { MdArrowDropDown } from 'react-icons/md'

const cx = bindClassNames(styles)

type Props = {
  user: CurrentUser
  onClick: (e: React.MouseEvent) => void
}

function HeaderUserIcon({ user, onClick }: Props) {
  return (
    <div className={cx('block')} onClick={onClick}>
      <Image
        src={user.profile.thumbnail || userThumbnail}
        alt="thumbnail"
        width={40}
        height={40}
      />
      <MdArrowDropDown />
    </div>
  )
}

export default HeaderUserIcon
