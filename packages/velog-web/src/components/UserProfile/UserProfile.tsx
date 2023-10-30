'use client'

import { CSSProperties, useRef, useState } from 'react'
import styles from './UserProfile.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { ProfileLinks } from '@/types/user'

const cx = bindClassNames(styles)

type Props = {
  className?: string
  style?: CSSProperties
  thumbnail: string | null
  displayName: string
  description: string
  profileLinks: ProfileLinks
  username: string
  followButton?: React.ReactNode
  ownPost?: boolean
}

function UserProfile({
  className,
  style,
  thumbnail,
  displayName,
  description,
  profileLinks,
  username,
  followButton,
  ownPost = false,
}: Props) {
  const { email, facebook, github, twitter, url } = profileLinks
  const [hoverEmail, setHoverEmail] = useState(false)
  const emailBlockRef = useRef<HTMLDivElement>(null)

  const onMouseEnterEmail = () => {
    setHoverEmail(true)
  }

  const onMouseLeaveEmail = (e: React.MouseEvent) => {
    if (e.relatedTarget === emailBlockRef.current) return
    setHoverEmail(false)
  }

  const velogUrl = `/@${username}`

  return (
    <div className={cx('block')}>
      <div className={cx('section')}>
        <div className={cx('left')}></div>
        <div className={cx('userInfo')}>
          <div className={cx('name')}></div>
          <div className={cx('description')}></div>
        </div>
        {!ownPost && followButton && <div className={cx('right')}>{followButton}</div>}
      </div>
      <div className={cx('seperator')}></div>
      <div className={cx('profileIcons')}></div>
    </div>
  )
}

export default UserProfile
