'use client'

import styles from './PostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import RatioImage from '@/components/RatioImage/RatioImage'
import { AdsQueryResult } from '@/actions/getAds'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import { PostCardSkeleton } from './PostCardSkeleton'

const cx = bindClassNames(styles)

type Props = {
  post: AdsQueryResult
  forHome: boolean
  forPost: boolean
  onClick?: () => void
}

function AdPostCard({ post, forHome = false, forPost = false, onClick }: Props) {
  const { loading } = useTimeFormat(post.start_date || new Date().toISOString())
  if (loading) return <PostCardSkeleton forHome={forHome} forPost={forPost} />

  return (
    <div
      className={cx('ad', 'block', { isNotHomeAndPost: !forHome && !forPost })}
      onClick={onClick}
    >
      {post.image && (
        <a href={post.url} target="_blank" className={cx('styleLink')}>
          <RatioImage
            widthRatio={1.916}
            heightRatio={1}
            src={post.image}
            alt={`${post.title} post`}
            width={320}
            height={167}
          />
        </a>
      )}
      <div className={cx('content')}>
        <a href={post.url} target="_blank" className={cx('styleLink')}>
          <h4 className={cx('h4', 'ellipsis')}>{post.title}</h4>
          <div className={cx('descriptionWrapper')}>
            <p className={cx({ clamp: !!post.image })}>
              {post?.body?.replace(/&#x3A;/g, ':')}
              {post?.body?.length === 150 && '...'}
            </p>
          </div>
        </a>
      </div>
      <div className={cx('footer')}>
        <span className={cx('text')}>광고</span>
      </div>
    </div>
  )
}

export default AdPostCard
