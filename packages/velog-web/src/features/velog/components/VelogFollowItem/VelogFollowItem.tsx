'use client'

import Thumbnail from '@/components/Thumbnail'
import styles from './VelogFollowItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useGetUserFollowInfoQuery } from '@/graphql/generated'
import FollowButton from '@/components/FollowButton'
import { useEffect, useState } from 'react'
import VelogFollowItemSkeleton from './VelogFollowItemSkeleton'
import Link from 'next/link'

const cx = bindClassNames(styles)

type Props = {
  userId: string
  thumbnail: string
  isFollowed: boolean
  description: string
  username: string
}

function VelogFollowItem({ userId, thumbnail, username, description }: Props) {
  const { data, isLoading } = useGetUserFollowInfoQuery({ input: { username } })
  const [isFollowed, setIsFollowed] = useState<boolean>(!!data?.user?.is_followed)

  useEffect(() => {
    setIsFollowed(!!data?.user?.is_followed)
  }, [data])

  const velogUrl = `/@${username}/posts`

  if (isLoading) return <VelogFollowItemSkeleton />
  return (
    <li className={cx('block')}>
      <Link href={velogUrl}>
        <Thumbnail className={cx('thumbnail')} width={40} height={40} thumbnail={thumbnail} />
      </Link>
      <div className={cx('content')}>
        <div className={cx('info')}>
          <span className={cx('text')}>Username</span>
          <span className={cx('username')}>
            <Link href={velogUrl}>{`@${username}`}</Link>
          </span>
        </div>
        <div className={cx('description')}>{description}</div>
      </div>
      <div className={cx('button')}>
        <FollowButton followingUserId={userId} isFollowed={!!isFollowed} />
      </div>
    </li>
  )
}

export default VelogFollowItem
