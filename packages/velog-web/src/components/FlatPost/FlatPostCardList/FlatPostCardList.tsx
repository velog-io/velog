import { PartialPosts } from '@/types/post'
import styles from './FlatPostCardList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  posts: PartialPosts[]
  hideUser: boolean
}

function FlatPostCardList({}: Props) {
  return <div className={cx('block')}></div>
}

export default FlatPostCardList
