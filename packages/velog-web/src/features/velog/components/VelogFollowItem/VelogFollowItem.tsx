'use client'

import Thumbnail from '@/components/Thumbnail'
import styles from './VelogFollowItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useGetUserFollowInfoQuery } from '@/graphql/generated'
import FollowButton from '@/components/FollowButton'
import { useEffect, useState } from 'react'
import VelogFollowItemSkeleton from './VelogFollowItemSkeleton'

const cx = bindClassNames(styles)

type Props = {
  displayName: string
  userId: string
  thumbnail: string
  isFollowed: boolean
  description: string
  username: string
}

function VelogFollowItem({ displayName, userId, thumbnail, username, description }: Props) {
  const { data, isLoading } = useGetUserFollowInfoQuery({ input: { username } })
  const [isFollowed, setIsFollowed] = useState<boolean>(!!data?.user?.is_followed)

  useEffect(() => {
    setIsFollowed(!!data?.user?.is_followed)
  }, [data])

  if (isLoading) return <VelogFollowItemSkeleton />
  return (
    <li className={cx('block')}>
      <Thumbnail className={cx('thumbnail')} width={40} height={40} thumbnail={thumbnail} />
      <div className={cx('content')}>
        <div className={cx('info')}>
          <span className={cx('text')}>Username</span>
          <span className={cx('username')}>{`@${displayName}`}</span>
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
