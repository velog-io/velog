'use client'

import Thumbnail from '@/components/Thumbnail'
import styles from './VelogFollowItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FollowButton from '@/components/FollowButton'
import Link from 'next/link'
import { Noto_Sans_KR } from 'next/font/google'

const cx = bindClassNames(styles)

type Props = {
  userId: string
  thumbnail: string
  isFollowed: boolean
  description: string
  username: string
}

const notoSansKr = Noto_Sans_KR({
  weight: ['300', '400'],
  subsets: ['latin'],
  display: 'swap',
})

function VelogFollowItem({ userId, thumbnail, username, description }: Props) {
  const velogUrl = `/@${username}/posts`
  return (
    <li className={cx('block')}>
      <Link href={velogUrl}>
        <Thumbnail className={cx('thumbnail')} src={thumbnail} />
      </Link>
      <div className={cx('content')}>
        <div className={cx('info')}>
          <span className={cx('text')}>Username</span>
          <span className={cx('username')}>
            <Link href={velogUrl}>{`@${username}`}</Link>
          </span>
        </div>
        <div className={cx('description', notoSansKr.className)}>{description}</div>
      </div>
      <div className={cx('button')}>
        <FollowButton username={username} followingUserId={userId} />
      </div>
    </li>
  )
}

export default VelogFollowItem
