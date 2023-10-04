import { Post } from '@/graphql/generated'
import styles from './PostViewer.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  post: Post | null
}

function PostViewer({}: Props) {
  return <div className={cx('block')}>postview</div>
}

export default PostViewer
