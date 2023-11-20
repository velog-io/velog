'use client'

import Thumbnail from '@/components/Thumbnail'
import styles from './VelogFollowItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { Post, useGetUserFollowInfoQuery } from '@/graphql/generated'
import FollowButton from '@/components/FollowButton'
import { useEffect, useState } from 'react'
import VelogFollowItemSkeleton from './VelogFollowItemSkeleton'

const cx = bindClassNames(styles)

type Props = {
  username: string
  userId: string
  thumbnail: string
  posts: Post[]
}

function VelogFollowItem({ username, userId, thumbnail, posts }: Props) {
  const { data, isLoading } = useGetUserFollowInfoQuery({ input: { username } })
  const [isFollowing, setIsFollowing] = useState<boolean>(!!data?.user?.is_followed)

  useEffect(() => {
    setIsFollowing(!!data?.user?.is_followed)
  }, [data])

  if (isLoading) return <VelogFollowItemSkeleton />
  return (
    <div className={cx('block')}>
      <Thumbnail className={cx('thumbnail')} width={40} height={40} thumbnail={thumbnail} />
      <div className={cx('content')}>
        <div className={cx('username')}>
          <span>Username</span>
          <span>{`@${username}`}</span>
        </div>
      </div>
      <FollowButton followingUserId={userId} isFollowing={!!isFollowing} />
    </div>
  )
}

export default VelogFollowItem
