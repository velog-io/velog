import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './VelogFollowingsEmpty.module.css'
import { UndrawFollowEmpty } from '@/assets/vectors/components'
import Link from 'next/link'

const cx = bindClassNames(styles)

type Props = {}

function VelogFollowingsEmpty({}: Props) {
  return (
    <div className={cx('block')}>
      <div className={cx('image')}>
        <UndrawFollowEmpty />
      </div>
      <p className={cx('text')}>팔로우 중인 사람이 없어요.</p>
      <Link href="/" className={cx('buttonWrapper')}>
        <button color="darkGray" className={cx('button')}>
          <span>인기 작가 둘러보기</span>
        </button>
      </Link>
    </div>
  )
}

export default VelogFollowingsEmpty
