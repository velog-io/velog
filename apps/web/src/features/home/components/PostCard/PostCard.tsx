'use client'

import styles from './PostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import RatioImage from '@/components/RatioImage/RatioImage'
import Image from 'next/image'
import { LikeIcon } from '@/assets/icons/components'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { PostCardSkeleton } from '@/features/home/components/PostCard/PostCardSkeleton'
import { Post } from '@/graphql/server/generated/server'
import VLink from '@/components/VLink'
import Link from 'next/link'

const cx = bindClassNames(styles)

type Props = {
  post: Post
  forHome: boolean
  forPost: boolean
  onClick: () => void
}

function PostCard({ post, forHome = false, forPost = false, onClick }: Props) {
  const url = `/@${post?.user?.username}/${post.url_slug}`
  const { time: releasedAt, isLoading } = useTimeFormat(post.released_at)

  if (isLoading) return <PostCardSkeleton forHome={forHome} forPost={forPost} />

  return (
    <li className={cx('block')} onClick={onClick}>
      {post.thumbnail && (
        <VLink href={url} className={cx('styleLink')}>
          <RatioImage
            widthRatio={1.916}
            heightRatio={1}
            src={post.thumbnail}
            alt={`${post.title} post`}
            fill={true}
          />
        </VLink>
      )}
      <div className={cx('content')}>
        <VLink href={url} className={cx('styleLink')}>
          <h4 className={cx('h4', 'ellipsis')}>{post.title}</h4>
          <div className={cx('descriptionWrapper')}>
            <p className={cx({ clamp: !!post.thumbnail })}>
              {post?.short_description?.replace(/&#x3A;/g, ':')}
              {post?.short_description?.length === 150 && '...'}
            </p>
          </div>
        </VLink>
        <div className={cx('subInfo')}>
          <span>{releasedAt}</span>
          <span className={cx('separator')}>·</span>
          <span>{post.comments_count}개의 댓글</span>
        </div>
      </div>
      <div className={cx('footer')}>
        <Link className={cx('userInfo')} href={`/@${post.user?.username}/posts`}>
          <Image
            src={post.user?.profile?.thumbnail || '/images/user-thumbnail.png'}
            alt={`user thumbnail of ${post.user?.profile.display_name}`}
            width={24}
            height={24}
          />
          <span>
            by <b>{post.user?.profile.display_name}</b>
          </span>
        </Link>
        <div className={cx('likes')}>
          <LikeIcon />
          {post.likes}
        </div>
      </div>
    </li>
  )
}

export default PostCard
