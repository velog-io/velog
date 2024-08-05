import SkeletonTexts from '@/components/Skeleton/SkeletonTexts'
import styles from './VelogAboutContent.module.css'
import { bindClassNames } from '@/lib/styles/bindClassNames'

const cx = bindClassNames(styles)

function VelogAboutContentSkeleton() {
  const skeletonParagraph = (
    <div className={cx('lines')}>
      <div className={cx('line')}>
        <SkeletonTexts wordLengths={[4, 6, 3, 2, 9, 3, 3, 5, 7, 6]} useFlex={true} />
      </div>
      <div className={cx('line')}>
        <SkeletonTexts wordLengths={[1, 2, 3, 4, 4, 2, 8, 4, 7, 6]} useFlex={true} />
      </div>
      <div className={cx('line')}>
        <SkeletonTexts wordLengths={[1, 6, 6, 2, 9, 3, 4, 2, 7, 4]} useFlex={true} />
      </div>
      <div className={cx('line')}>
        <SkeletonTexts wordLengths={[3, 6, 5, 5, 9]} />
      </div>
    </div>
  )
  return (
    <div className={cx('block', 'skeletonBlock')}>
      <h1>
        <SkeletonTexts wordLengths={[4, 3, 5, 4, 4, 6]} />
      </h1>
      {skeletonParagraph}
      {skeletonParagraph}
      {skeletonParagraph}
    </div>
  )
}

export default VelogAboutContentSkeleton
