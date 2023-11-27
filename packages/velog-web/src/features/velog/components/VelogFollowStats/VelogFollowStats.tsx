'use client'

import Thumbnail from '@/components/Thumbnail'
import styles from './VelogFollowStats.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { useGetUserFollowInfoQuery } from '@/graphql/generated'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const cx = bindClassNames(styles)

type Props = {
  category: string
  text: string
  followCount: number
  thumbnail: string | null
  displayName: string
  username: string
  type: 'following' | 'follower'
}

function VelogFollowStats({
  category,
  text,
  followCount,
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
      cacheTime: 0,
      staleTime: 0,
    },
  )

  const [follows, setFollows] = useState<number>(followCount)

  useEffect(() => {
    const count = type === 'follower' ? data?.user?.followers_count : data?.user?.followings_count
    setFollows(count ?? 0)
  }, [data, type])

  const velogUrl = `/@${username}/posts`
  return (
    <section className={cx('block')}>
      <div className={cx('header')}>
        <div className={cx('category')}>
          <div className={cx('imageWrapper')}>
            <Link href={velogUrl}>
              <Thumbnail className={cx('thumbnail')} src={thumbnail} />
            </Link>
          </div>
          <span className={cx('displayName')}>
            <Link href={velogUrl}>{displayName}</Link>
          </span>
          <span className={cx('allow')}>{'>'}</span>
          <span className={cx('subCategory')}>{category}</span>
        </div>
        <div className={cx('info')}>
          <b className={cx('bold')}>{follows.toLocaleString()}명</b>
          <span className={cx('text')}>{text}</span>
        </div>
      </div>
    </section>
  )
}

export default VelogFollowStats
