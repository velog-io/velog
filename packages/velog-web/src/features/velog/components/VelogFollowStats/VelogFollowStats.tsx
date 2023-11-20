'use client'

import Thumbnail from '@/components/Thumbnail'
import styles from './VelogFollowStats.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useGetUserFollowInfoQuery } from '@/graphql/generated'

const cx = bindClassNames(styles)

type Props = {
  category: string
  text: string
  totalCount: number
  thumbnail: string | null
  displayName: string
  username: string
  type: 'following' | 'follower'
}

function VelogFollowStats({
  category,
  text,
  totalCount,
  thumbnail,
  displayName,
  username,
  type,
}: Props) {
  const { data } = useGetUserFollowInfoQuery(
    {
      input: {
        username,
      },
    },
    {
      networkMode: 'always',
    },
  )

  const followersCount = data?.user?.followers_count ?? totalCount
  const followingsCount = data?.user?.followings_count ?? totalCount

  return (
    <section className={cx('block')}>
      <div className={cx('header')}>
        <div className={cx('category')}>
          <div className={cx('thumbnail')}>
            <Thumbnail thumbnail={thumbnail} width={32} height={32} />
          </div>
          <span className={cx('displayName')}>{displayName}</span>
          <span className={cx('allow')}>{'>'}</span>
          <span className={cx('subCategory')}>{category}</span>
        </div>
        <div className={cx('info')}>
          <b className={cx('bold')}>
            {type === 'follower'
              ? followersCount.toLocaleString()
              : followingsCount.toLocaleString()}
            명
          </b>
          <span className={cx('text')}>{text}</span>
        </div>
      </div>
    </section>
  )
}

export default VelogFollowStats
