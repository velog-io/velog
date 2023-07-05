import { PartialPost } from '@/types/post'
import styles from './PostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

import gtag from '@/lib/gtag'
import Link from 'next/link'
import RatioImage from '@/components/RatioImage/RatioImage'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import { userThumbnail } from '@/public/images'
import XLink from '@/components/XLink'

const cx = bindClassNames(styles)

type Props = {
  post: PartialPost
  forHome: boolean
  forPost: boolean
}

async function PostCard({ post, forHome = false, forPost = false }: Props) {
  const url = `/@${post.user.username}/${post.url_slug}`
  return (
    <div className={cx('block', { isNotHomeAndPost: !forHome && !forPost })}>
      {post.thumbnail && (
        <XLink href={url} className={cx('styleLink')}>
          <RatioImage
            widthRatio={1.916}
            heightRatio={1}
            src={post.thumbnail}
            alt={`${post.title} post`}
            width={320}
            height={167}
          />
        </XLink>
      )}
      <div className={cx('content')}>
        <XLink href={url} className={cx('styleLink')}>
          <h4>{post.title}</h4>
          <div className={cx('descriptionWrapper')}>
            <p className={cx({ clamp: !!post.thumbnail })}>
              {post.short_description.replace(/&#x3A;/g, ':')}
              {post.short_description.length === 150 && '...'}
            </p>
          </div>
        </XLink>
        <div className={cx('subInfo')}>
          <span>{formatDate(post.released_at)}</span>
          <span className={cx('separator')}>·</span>
          <span>{post.comments_count}개의 댓글</span>
        </div>
      </div>
      <div className={cx('footer')}>
        <XLink className={cx('userInfo')} href={`/@${post.user.username}`}>
          <Image
            src={post.user.profile.thumbnail || userThumbnail}
            alt={`user thumbnail of ${post.user.username}`}
            width={24}
            height={24}
          />
          <span>
            by <b>{post.user.username}</b>
          </span>
        </XLink>
        <div className={cx('likes')}>
          <Image src="/svg/icon-like.svg" alt="likes" width={12} height={12} />
          {post.likes}
        </div>
      </div>
    </div>
  )
}

export default PostCard
