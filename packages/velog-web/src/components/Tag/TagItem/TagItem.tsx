import Link from 'next/link'
import styles from './TagItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { escapeForUrl } from '@/lib/utils'

const cx = bindClassNames(styles)

type Props = {
  name: string
  link?: boolean
}

function TagItem({ name, link }: Props) {
  if (link) {
    return (
      <Link className={cx('tagLink', 'default')} href={`/tags/${escapeForUrl(name)}`}>
        {name}
      </Link>
    )
  }
  return <div className={cx('default')}>{name}</div>
}

export default TagItem
