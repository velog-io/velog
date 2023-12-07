import styles from './PostCardGrid.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { PostCardSkeleton } from '@/features/home/components/PostCard/PostCardSkeleton'
import { ENV } from '@/env'
import { nanoid } from 'nanoid'

const cx = bindClassNames(styles)

type Props = {
  forHome: boolean
  forPost: boolean
}

function PostCardSkeletonGrid({ forHome, forPost }: Props) {
  return (
    <ul className={cx('block', 'skeleton', 'homeGrid')}>
      {Array(ENV.defaultPostLimit)
        .fill(0)
        .map(() => (
          <PostCardSkeleton key={nanoid()} forHome={forHome} forPost={forPost} />
        ))}
    </ul>
  )
}

export default PostCardSkeletonGrid
