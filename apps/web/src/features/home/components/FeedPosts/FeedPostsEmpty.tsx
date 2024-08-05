import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './FeedPostsEmpty.module.css'
import { UndrawFollowEmpty } from '@/assets/vectors/components'
import Link from 'next/link'

const cx = bindClassNames(styles)

type Props = {}

function FeedPostsEmpty({}: Props) {
  return (
    <div className={cx('block')}>
      <div className={cx('image')}>
        <UndrawFollowEmpty />
      </div>
      <p className={cx('text')}>새로운 피드가 없네요.</p>
      <Link href="/trending-writers" className={cx('buttonWrapper')}>
        <button color="darkGray" className={cx('button')}>
          <span>인기 작가 둘러보기</span>
        </button>
      </Link>
    </div>
  )
}

export default FeedPostsEmpty
