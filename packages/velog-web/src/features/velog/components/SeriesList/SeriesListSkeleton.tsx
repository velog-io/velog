import SeriesItemSkeleton from '../SeriesItem/SeriesItemSkeleton'
import styles from './SeriesList.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

function SeriesListSkeleton() {
  return (
    <div className={cx('block')}>
      <SeriesItemSkeleton />
      <SeriesItemSkeleton />
      <SeriesItemSkeleton />
      <SeriesItemSkeleton />
    </div>
  )
}

export default SeriesListSkeleton
