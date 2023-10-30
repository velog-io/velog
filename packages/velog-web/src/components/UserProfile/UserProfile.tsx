'use client'

import { CSSProperties, useRef, useState } from 'react'
import styles from './UserProfile.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { ProfileLinks } from '@/types/user'
import Link from 'next/link'
import Image from 'next/image'
import { EmailIcon, FacebookSquareIcon, GithubIcon, TwitterIcon } from '@/assets/icons/components'
import { includeProtocol } from '@/lib/includeProtocol'
import { MdHome } from 'react-icons/md'

const cx = bindClassNames(styles)

type Props = {
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
    <div className={cx('block')} style={style}>
      <div className={cx('section')}>
        <div className={cx('left')}>
          <Link href={velogUrl}>
            <Image
              src={thumbnail || '/images/user-thumbnail.png'}
              width={128}
              height={128}
              alt="profile"
            />
          </Link>
        </div>
        <div className={cx('userInfo')}>
          <div className={cx('name')}>
            <Link href={velogUrl}>{displayName}</Link>
          </div>
          <div className={cx('description')}>{description}</div>
        </div>
        {!ownPost && followButton && <div className={cx('right')}>{followButton}</div>}
      </div>
      <div className={cx('seperator')}></div>
      <div className={cx('profileIcons')}>
        {github && (
          <a
            href={`https://github.com/${github}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="github"
          >
            <GithubIcon />
          </a>
        )}
        {twitter && (
          <a
            href={`https://twitter.com/${twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="twitter"
          >
            <TwitterIcon />
          </a>
        )}
        {facebook && (
          <a
            href={`https://facebook.com/${facebook}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="facebook"
          >
            <FacebookSquareIcon />
          </a>
        )}
        {url && (
          <a
            href={includeProtocol(url)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="facebook"
          >
            <MdHome />
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`}>
            <EmailIcon
              data-testid="email"
              onMouseEnter={onMouseEnterEmail}
              onMouseLeave={onMouseLeaveEmail}
            />
          </a>
        )}
        {hoverEmail && (
          <div className={cx('emailBlock')} ref={emailBlockRef} onMouseLeave={onMouseLeaveEmail}>
            <div>{email}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile
