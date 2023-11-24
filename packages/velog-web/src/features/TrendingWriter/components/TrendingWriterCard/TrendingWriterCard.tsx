import { TrendingWriterPosts, useGetUserFollowInfoQuery } from '@/graphql/generated'
import styles from './TrendingWriterCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
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

  if (isLoading) return <TrendingWriterCardSkeleton />
  const velogUrl = `/@${username}/posts`
  return (
    <li className={cx('block')}>
      <div className={cx('header')}>
        <div className={cx('left')}>
          <Link href={velogUrl}>
            <Thumbnail src={thumbnail} className={cx('thumbnail')} />
          </Link>
          <Link href={velogUrl} className={cx('displayName', 'ellipsis')}>
            {displayName}
          </Link>
        </div>
        <div className={cx('right')}>
          <FollowButton
            isFollowed={data?.user?.is_followed}
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
