import styles from './TagItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { escapeForUrl } from '@/lib/utils'
import VLink from '@/components/VLink'

const cx = bindClassNames(styles)

type Props = {
  name: string
  link?: boolean
}

function TagItem({ name, link }: Props) {
  if (link) {
    return (
      <VLink className={cx('tagLink', 'default')} href={`/tags/${escapeForUrl(name)}`}>
        {name}
      </VLink>
    )
  }
  return <div className={cx('default')}>{name}</div>
}

export default TagItem
