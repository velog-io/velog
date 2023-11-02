import { PartialPosts } from '@/types/post'
import styles from './FlatPostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Link from 'next/link'
import Image from 'next/image'
import RatioImage from '@/components/RatioImage'

const cx = bindClassNames(styles)

type Props = {
  post: PartialPosts
  hideUser: boolean
}

function FlatPostCard({ post, hideUser }: Props) {
  if (!post.user) return null
  const url = `/@${post.user.username}/${post.url_slug}`
  const velogUrl = `/@${post.user.username}`

  return (
    <div className={cx('block')}>
      {!hideUser && (
        <div className={cx('userInfo')}>
          <Link href={velogUrl}>
            <Image
              src={post.user.profile?.thumbnail || '/images/user-thumbnail.png'}
              alt="post-card-thumbnail"
            />
          </Link>
          <div className={cx('username')}>
            <Link href={`/@${post.user.username}`}>{post.user.username}</Link>
          </div>
        </div>
      )}
      {post.thumbnail && (
        <Link href={url}>
          <RatioImage
            src={post.thumbnail}
            alt="post-thumbnail"
            widthRatio={1.91}
            heightRatio={1}
            className="postThumbnail"
          />
        </Link>
      )}
      <Link href={url}>
        <h2>{post.title}</h2>
      </Link>
      <p>{post.short_description}</p>
      <div className={cx('tagsWrapper')}>{post.tags?.map((tag) => null)}</div>
    </div>
  )
}

export default FlatPostCard
