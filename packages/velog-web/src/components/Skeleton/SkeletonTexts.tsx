import { bindClassNames } from '@/lib/styles/bindClassNames'
import styles from './Skeleton.module.css'
import Skeleton from '@/components/Skeleton/Skeleton'

const cx = bindClassNames(styles)

type Props = {
  wordLengths: number[]
  useFlex?: boolean
}

function SkeletonTexts({ wordLengths, useFlex }: Props) {
  return (
    <>
      {wordLengths.map((length, index) => {
        const props = {
          [useFlex ? 'flex' : 'width']: useFlex ? length : `${length}rem`,
        }
        return <Skeleton key={index} {...props} />
      })}
    </>
  )
}

export default SkeletonTexts
