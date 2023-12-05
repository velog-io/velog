import { Tag } from '@/graphql/generated'
import styles from './VelogTagVerticalList.module.css'
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

function VelogTagVerticalList({ active, tags, postsCount, username }: Props) {
  return (
    <aside className={cx('block')}>
      <div className={cx('title')}>태그 목록</div>
      <ul>
        <li className={cx('listItem', { active: !active })}>
          <Link href={`/@${username}/posts`}>전체보기</Link>
          <span>({postsCount})</span>
        </li>
        {tags.map((tag) => (
          <li
            key={tag.id}
            className={cx('listItem', { active: active === escapeForUrl(tag.name!) })}
          >
            <Link
              className={cx('name', 'ellipsis')}
              href={`/@${username}/posts?tag=${escapeForUrl(tag.name!)}`}
            >
              {tag.name}
            </Link>
            <span>({tag.posts_count})</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default VelogTagVerticalList
