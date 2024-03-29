import { Post } from '@/graphql/helpers/generated'
import styles from './FlatPostCardList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import FlatPostCard from '../FlatPostCard/FlatPostCard'

const cx = bindClassNames(styles)

type Props = {
  posts: Post[]
  hideUser: boolean
}

function FlatPostCardList({ posts, hideUser }: Props) {
  return (
    <div className={cx('block')}>
      {posts.map((post) => (
        <FlatPostCard key={post.id} post={post} hideUser={hideUser} />
      ))}
    </div>
  )
}

export default FlatPostCardList
