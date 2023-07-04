import { PartialPost } from '@/types/post'
import styles from './PostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

import { useRef } from 'react'
import usePrefetchPost from '@/features/post/hooks/usePrefetchPost'
import gtag from '@/lib/gtag'
import Link from 'next/link'
import RatioImage from '@/components/RatioImage/RatioImage'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import { userThumbnail } from '@/public/images'
import { LikeIcon } from '@/public/svg'

const cx = bindClassNames(styles)

type Props = {
  post: PartialPost
  forHome: boolean
  forPost: boolean
}

function PostCard({ post, forHome = false, forPost = false }: Props) {
  const url = `/@${post.user.username}/${post.url_slug}`

  const prefetch = usePrefetchPost({
    username: post.user.username,
    url_slug: post.url_slug,
  })
  const prefetchTimerId = useRef(-1)

  const onMouseEnter = () => {
    prefetchTimerId.current = window.setTimeout(() => {
      prefetch // default from cache
    }, 2000)
  }

  const onMouseLeave = () => {
    if (prefetchTimerId.current) {
      clearTimeout(prefetchTimerId.current)
    }
  }

  return (
    <div
      className={cx('block', { isNotHomeAndPost: !forHome && !forPost })}
      onClick={() => {
        gtag('event', 'recommend_click')
      }}
    >
      {post.thumbnail && (
        <Link href={url} className={cx('styleLink')}>
          <RatioImage
            widthRatio={1.916}
            heightRatio={1}
            src={post.thumbnail}
            alt={`${post.title} post`}
          />
        </Link>
      )}
      <div className={cx('content')}>
        <Link href={url} className={cx('styleLink')}>
          <h4>{post.title}</h4>
          <div className={cx('descriptionWrapper')}>
            <p className={cx({ clamp: !!post.thumbnail })}>
              {post.short_description.replace(/&#x3A;/g, ':')}
              {post.short_description.length === 150 && '...'}
            </p>
          </div>
        </Link>
        <div className={cx('subInfo')}>
          <span>{formatDate(post.released_at)}</span>
          <span className={cx('separator')}>·</span>
          <span>{post.comments_count}개의 댓글</span>
        </div>
      </div>
      <div className={cx('footer')}>
        <Link className={cx('userInfo')} href={`/@${post.user.username}`}>
          <Image
            src={post.user.profile.thumbnail || userThumbnail}
            alt={`user thumbnail of ${post.user.username}`}
          />
          <span>
            by <b>{post.user.username}</b>
          </span>
        </Link>
        <div className={cx('likes')}>
          <LikeIcon />
          {post.likes}
        </div>
      </div>
    </div>
  )
}

export default PostCard
