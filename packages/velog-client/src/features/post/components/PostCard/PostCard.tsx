import { PartialPost } from '@/types/post'
import styles from './PostCard.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  post: PartialPost
  forHome?: boolean
  forPost?: boolean
}

function PostCard({ post, forHome, forPost }: Props) {
  const url = `/@${post.user.username}/${post.url_slug}`
  return <div className={cx('block')}></div>
}

export default PostCard
