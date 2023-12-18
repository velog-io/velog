import { TrendingWriterPosts } from '@/graphql/generated'
import styles from './TrendingWriterCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Link from 'next/link'
import Thumbnail from '@/components/Thumbnail'
import FollowButton from '@/components/FollowButton'
import VLink from '@/components/VLink'

const cx = bindClassNames(styles)

type Props = {
  writerId: string
  posts: TrendingWriterPosts[]
  thumbnail?: string | null
  displayName: string
  username: string
}

function TrendingWriterCard({ writerId, posts, thumbnail, displayName, username }: Props) {
  const velogUrl = `/@${username}/posts`
  return (
    <li className={cx('block')}>
      <div className={cx('header')}>
        <div className={cx('left')}>
          <Link href={velogUrl}>
            <Thumbnail src={thumbnail} className={cx('thumbnail')} />
          </Link>
          <Link href={velogUrl} className={cx('displayName', 'ellipsis')}>
            <span>{displayName}</span>
          </Link>
        </div>
        <div className={cx('right')}>
          <FollowButton username={username} followingUserId={writerId} className={cx('button')} />
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
