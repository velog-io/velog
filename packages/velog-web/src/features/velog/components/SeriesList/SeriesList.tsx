import styles from './SeriesList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'
import { UndrawBlankCanvas } from '@/assets/vectors/components'
import SeriesItem from '../SeriesItem'
import { UserSeriesList } from '@/types/series'

const cx = bindClassNames(styles)

type Props = {
  list: UserSeriesList[]
  username: string
}

function SeriesList({ list, username }: Props) {
  return (
    <div className={cx('block')}>
      {list.length === 0 && (
        <div className={cx('empty')}>
          <UndrawBlankCanvas width={320} height={320} />
          <div className={cx('message')}>시리즈가 없습니다.</div>
        </div>
      )}
      {list.map((series) => (
        <SeriesItem
          key={series.id}
          name={series.name!}
          postsCount={series.posts_count!}
          thumbnail={series.thumbnail || ''}
          lastUpdate={series.updated_at}
          username={username}
          urlSlug={series.url_slug!}
        />
      ))}
    </div>
  )
}

export default SeriesList
