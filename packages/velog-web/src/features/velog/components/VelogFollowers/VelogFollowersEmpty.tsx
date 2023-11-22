import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './VelogFollowersEmpty.module.css'
import { UndrawFollowEmpty } from '@/assets/vectors/components'

const cx = bindClassNames(styles)

type Props = {}

function VelogFollowersEmpty({}: Props) {
  return (
    <div className={cx('block')}>
      <div className={cx('image')}>
        <UndrawFollowEmpty />
      </div>
      <p className={cx('text')}>팔로워가 없어요.</p>
      <p className={cx('subText')}>게시물을 작성하고 다른 사람들과 소통하여 팔로워를 늘려보세요.</p>
    </div>
  )
}

export default VelogFollowersEmpty
