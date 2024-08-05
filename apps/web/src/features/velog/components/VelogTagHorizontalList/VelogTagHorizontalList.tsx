import { Tag } from '@/graphql/server/generated/server'
import styles from './VelogTagHorizontalList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Link from 'next/link'
import { escapeForUrl } from '@/lib/utils'

const cx = bindClassNames(styles)

type Props = {
  active?: string
  tags: Tag[]
  postsCount: number
  username: string
}

function VelogTagHorizontalList({ active, tags, postsCount, username }: Props) {
  return (
    <div className={cx('block')}>
      <Link href={`/@${username}/posts`} className={cx('tagItem', { active: !active })}>
        전체보기 <span>({postsCount})</span>
      </Link>
      {tags.map((tag) => (
        <Link
          className={cx('tagItem', { active: active === escapeForUrl(tag.name!) })}
          href={`/@${username}/posts?tag=${escapeForUrl(tag.name!)}`}
          key={tag.id}
        >
          {tag.name}
          <span>({tag.posts_count})</span>
        </Link>
      ))}
    </div>
  )
}

export default VelogTagHorizontalList
