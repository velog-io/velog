import { Post } from '@/graphql/helpers/generated'
import styles from './FlatPostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Link from 'next/link'
import Image from 'next/image'
import TagItem from '@/components/Tag/TagItem'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { LikeIcon } from '@/assets/icons/components'
import PrivatePostLabel from '@/components/PrivatePostLabel'
import FlatPostCardSkeleton from './FlatPostCardSkeleton'
import VLink from '@/components/VLink'

const cx = bindClassNames(styles)

type Props = {
  post: Post
  hideUser: boolean
}

function FlatPostCard({ post, hideUser }: Props) {
  const { time: releasedAt, isLoading } = useTimeFormat(post.released_at!)

  if (isLoading) return <FlatPostCardSkeleton hideUser={hideUser} />
  if (!post.user || !post.released_at) return null

  const url = `/@${post.user.username}/${post.url_slug}`
  const velogUrl = `/@${post.user.username}/posts`

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
        <VLink href={url} className={cx('postThumbnail')}>
          <Image src={post.thumbnail} alt="post-thumbnail" fill={true} priority={true} />
        </VLink>
      )}
      <VLink href={url}>
        <h2>{post.title}</h2>
      </VLink>
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
