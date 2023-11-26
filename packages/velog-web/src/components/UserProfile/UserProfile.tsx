'use client'

import { CSSProperties, useEffect, useRef, useState } from 'react'
import styles from './UserProfile.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { ProfileLinks } from '@/types/user'
import Link from 'next/link'
import Image from 'next/image'
import { EmailIcon, FacebookSquareIcon, GithubIcon, TwitterIcon } from '@/assets/icons/components'
import { includeProtocol } from '@/lib/includeProtocol'
import { MdHome } from 'react-icons/md'
import FollowButton from '../FollowButton'
import { useAuth } from '@/state/auth'
import { useGetUserFollowInfoQuery } from '@/graphql/generated'
import { notFound, useParams } from 'next/navigation'
import { getUsernameFromParams } from '@/lib/utils'

const cx = bindClassNames(styles)

type Props = {
  style?: CSSProperties
}

function UserProfile({ style }: Props) {
  const params = useParams()
  const username = getUsernameFromParams(params)
  const {
    value: { currentUser },
  } = useAuth()

  const { data, refetch, isRefetching, isLoading } = useGetUserFollowInfoQuery({
    input: { username: username },
  })

  const user = data?.user

  if (!user) {
    notFound()
  }

  const { display_name, profile_links, short_bio, thumbnail } = user.profile
  const { email, facebook, github, twitter, url } = profile_links as ProfileLinks

  const [hoverEmail, setHoverEmail] = useState(false)
  const emailBlockRef = useRef<HTMLDivElement>(null)

  const [followersCnt, setFollowersCnt] = useState<number>(user.followers_count)
  const onMouseEnterEmail = () => {
    setHoverEmail(true)
  }

  const onMouseLeaveEmail = (e: React.MouseEvent) => {
    if (e.relatedTarget === emailBlockRef.current) return
    setHoverEmail(false)
  }

  const userId = user.id
  const getSocialId = (link: string) => link.split('/').reverse()[0]

  const onFollowSuccess = async (type: 'follow' | 'unfollow') => {
    if (type === 'follow') {
      setFollowersCnt((state) => state + 1)
    } else {
      setFollowersCnt((state) => state - 1)
    }
    refetch()
  }

  useEffect(() => {
    if (isRefetching) return
    setFollowersCnt(data?.user?.followers_count ?? followersCnt)
  }, [isRefetching, data, followersCnt])

  const velogUrl = `/@${user.username}`
  const isOwn = userId === currentUser?.id
  if (isLoading) return null
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
              priority={true}
            />
          </Link>
          <div className={cx('userInfo')}>
            <div className={cx('name')}>
              <Link href={velogUrl}>{display_name}</Link>
            </div>
            <div className={cx('description')}>{short_bio}</div>
          </div>
        </div>
      </div>
      <div className={cx('seperator')}></div>
      <div className={cx('bottom')}>
        <div className={cx('followInfo')}>
          <Link href={`${velogUrl}/followers`} className={cx('info')}>
            <span className={cx('number')}>{followersCnt}</span>
            <span className={cx('text')}>팔로워</span>
          </Link>
          <Link href={`${velogUrl}/followings`} className={cx('info')}>
            <span className={cx('number')}>{user.followings_count}</span>
            <span className={cx('text')}>팔로잉</span>
          </Link>
        </div>
        <div className={cx('section')}>
          <div className={cx('icons')}>
            {github && (
              <a
                href={`https://github.com/${getSocialId(github)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="github"
              >
                <GithubIcon />
              </a>
            )}
            {twitter && (
              <a
                href={`https://twitter.com/${getSocialId(twitter)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="twitter"
              >
                <TwitterIcon />
              </a>
            )}
            {facebook && (
              <a
                href={`https://facebook.com/${getSocialId(facebook)}`}
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
              <div
                className={cx('emailBlock')}
                ref={emailBlockRef}
                onMouseLeave={onMouseLeaveEmail}
              >
                <div>{email}</div>
              </div>
            )}
          </div>
          <div className={cx('inner', 'button')}>
            {!isOwn && (
              <FollowButton
                followingUserId={userId}
                onSuccess={onFollowSuccess}
                isFollowed={data?.user?.is_followed}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
