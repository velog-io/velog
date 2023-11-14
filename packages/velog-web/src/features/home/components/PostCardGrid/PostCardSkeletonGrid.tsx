import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { PostCardSkeleton } from '@/features/home/components/PostCard/PostCardSkeleton'
import { ENV } from '@/env'

const cx = bindClassNames(styles)

type Props = {
  forHome: boolean
  forPost: boolean
}

function PostCardSkeletonGrid({ forHome, forPost }: Props) {
  return (
    <div className={cx('block')}>
      {Array(ENV.defaultPostLimit)
        .fill(0)
        .map((_, i) => (
          <PostCardSkeleton key={i} forHome={forHome} forPost={forPost} />
        ))}
    </div>
  )
}

export default PostCardSkeletonGrid
