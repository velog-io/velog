import TagItem from '../TagItem'
import styles from './TagList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

type Props = {
  link?: boolean
  tags: string[]
  className?: string
}

function TagList({ link, tags, className }: Props) {
  return (
    <div className={cx('block', className)}>
      {tags.map((tag) => (
        <TagItem key={tag} name={tag} link={link} />
      ))}
    </div>
  )
}

export default TagList
