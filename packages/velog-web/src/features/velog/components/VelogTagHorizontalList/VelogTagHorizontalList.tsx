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

function VelogTagHorizontalList({}: Props) {
  return <div className={cx('block')}></div>
}

export default VelogTagHorizontalList
