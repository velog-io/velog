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

function VelogFollowItem({ displayName, userId, thumbnail }: Props) {
  const { data, isLoading } = useGetUserFollowInfoQuery({ input: { username } })
  const [isFollowed, setIsFollowed] = useState<boolean>(!!data?.user?.is_followed)

  useEffect(() => {
    setIsFollowed(!!data?.user?.is_followed)
  }, [data])

  if (isLoading) return <VelogFollowItemSkeleton />
  return (
    <div className={cx('block')}>
      <Thumbnail className={cx('thumbnail')} width={40} height={40} thumbnail={thumbnail} />
      <div className={cx('content')}>
        <div className={cx('username')}>
          <span>Username</span>
          <span>{`@${displayName}`}</span>
        </div>
      </div>
      <FollowButton followingUserId={userId} isFollowed={!!isFollowed} />
    </div>
  )
}

export default VelogFollowItem
