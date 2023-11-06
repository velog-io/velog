import PlainLink from '@/components/PlainLink'
import styles from './SeriesItem.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import Image from 'next/image'
import { SeriesThumbnail } from '@/assets/vectors/components'
import { useTimeFormat } from '@/hooks/useTimeFormat'
import SeriesItemSkeleton from './SeriesItemSkeleton'

const cx = bindClassNames(styles)

type Props = {
  thumbnail: string | null
  name: string
  postsCount: number
  lastUpdate: string
  username: string
  urlSlug: string
}

function SeriesItem({ thumbnail, name, postsCount, lastUpdate, urlSlug, username }: Props) {
  const { time, isLoading } = useTimeFormat(lastUpdate)
  const url = `/@${username}/series/${urlSlug}`

  if (isLoading) return <SeriesItemSkeleton />
  return (
    <div className={cx('block')}>
      <PlainLink href={url} className={cx('styledLink')}>
        {thumbnail ? (
          <Image src={thumbnail} alt="series thumbnail" width={368} height={193} />
        ) : (
          <SeriesThumbnail width={368} height={193} />
        )}
      </PlainLink>
      <h4>
        <PlainLink href={url} className={cx('styledLink', 'ellipsis')}>
          {name}
        </PlainLink>
      </h4>
      <div className={cx('info')}>
        <span className={cx('count')}>{postsCount}개의 포스트</span>
        <span className={cx('dot')}>·</span>
        마지막 업데이트 {time}
      </div>
    </div>
  )
}

export default SeriesItem
