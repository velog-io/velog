import { Post } from '@/graphql/generated'
import styles from './FlatPostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Link from 'next/link'
import Image from 'next/image'
import RatioImage from '@/components/RatioImage'
import TagItem from '@/components/Tag/TagItem'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { LikeIcon } from '@/assets/icons/components'
import PrivatePostLabel from '@/components/PrivatePostLabel'
import FlatPostCardSkeleton from './FlatPostCardSkeleton'

const cx = bindClassNames(styles)

type Props = {
  post: Post
  hideUser: boolean
}

function FlatPostCard({ post, hideUser }: Props) {
  const { time: releasedAt, loading } = useTimeFormat(post.released_at!)

  if (loading) return <FlatPostCardSkeleton hideUser={hideUser} />
  if (!post.user || !post.released_at) return null

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
              width={48}
              height={48}
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
            width={768}
            height={402}
          />
        </Link>
      )}
      <Link href={url}>
        <h2>{post.title}</h2>
      </Link>
      <p>{post.short_description}</p>
      <div className={cx('tagsWrapper')}>
        {post.tags?.map((tag) => <TagItem key={tag} name={tag} link={true} />)}
      </div>
      <div className={cx('subInfo')}>
        <span>{releasedAt}</span>
        <div className={cx('seperator')}>.</div>
        <span>{post.comments_count}개의 댓글</span>
        <div className={cx('seperator')}>·</div>
        <span className={cx('likes')}>
          <LikeIcon />
          {post.likes}
        </span>
        {post.is_private && (
          <>
            <div className={cx('seperator')}>·</div>
            <span>
              <PrivatePostLabel />
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default FlatPostCard
