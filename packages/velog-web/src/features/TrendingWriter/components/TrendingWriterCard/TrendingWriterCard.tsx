import { TrendingWriterPosts, useGetUserFollowInfoQuery } from '@/graphql/generated'
import styles from './TrendingWriterCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useEffect, useState } from 'react'
import TrendingWriterCardSkeleton from './TrendingWriterCardSkeleton'
import Link from 'next/link'
import Thumbnail from '@/components/Thumbnail'
import FollowButton from '@/components/FollowButton'
import VLink from '@/components/VLink'

const cx = bindClassNames(styles)

type Props = {
  writerId: string
  posts: TrendingWriterPosts[]
  thumbnail: string
  displayName: string
  username: string
}

function TrendingWriterCard({ writerId, posts, thumbnail, displayName, username }: Props) {
  const { data, isLoading } = useGetUserFollowInfoQuery({ input: { id: writerId } })
  const [isFollowed, setIsFollowed] = useState<boolean>(!!data?.user?.is_followed)

  useEffect(() => {
    setIsFollowed(!!data?.user?.is_followed)
  }, [data])

  if (isLoading) return <TrendingWriterCardSkeleton />
  const velogUrl = `/@${username}/posts`
  return (
    <li className={cx('block')}>
      <div className={cx('header')}>
        <div className={cx('left')}>
          <Link href={velogUrl}>
            <Thumbnail src={thumbnail} className={cx('thumbnail')} />
          </Link>
          <span className={cx('displayName', 'ellipsis')}>{displayName}</span>
        </div>
        <div className={cx('right')}>
          <FollowButton
            isFollowed={isFollowed}
            followingUserId={writerId}
            className={cx('button')}
          />
        </div>
      </div>
      <ul className={cx('content')}>
        {posts.map((post) => (
          <li key={post.url_slug} className={cx('post')}>
            <VLink href={`/@${username}/${post.url_slug}`} className={cx('title')}>
              {post.title}
            </VLink>
          </li>
        ))}
      </ul>
    </li>
  )
}

export default TrendingWriterCard
