import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { PostCardSkeleton } from '@/features/post/components/PostCard/PostCardSkeleton'

const cx = bindClassNames(styles)

type Props = {
  forHome: boolean
  forPost: boolean
}

function PostCardSkeletonGrid({ forHome, forPost }: Props) {
  return (
    <div className={cx('block')}>
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <PostCardSkeleton key={i} forHome={forHome} forPost={forPost} />
        ))}
    </div>
  )
}

export default PostCardSkeletonGrid
