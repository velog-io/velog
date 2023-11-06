import { Tag } from '@/graphql/generated'
import styles from './VelogTagHorizontalList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  active: string | null
  tags: Tag[]
  postsCount: number
  username: string
}

function VelogTagHorizontalList({ active, tags, postsCount, username }: Props) {
  return <div className={cx('block')}>horizontalList</div>
}

export default VelogTagHorizontalList
