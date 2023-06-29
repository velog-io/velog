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
        src="https://velog.velcdn.com/images/carrick/profile/a54ea444-7dbb-4f14-91c1-4bfbb5b8e5ad/social_profile.png"
        alt="thumbnail"
        width={40}
        height={40}
      />
      <MdArrowDropDown />
    </div>
  )
}

export default HeaderUserIcon
