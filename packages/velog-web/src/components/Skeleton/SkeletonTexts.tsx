import Skeleton from '@/components/Skeleton/Skeleton'

type Props = {
  wordLengths: number[]
  useFlex?: boolean
  className?: string
}

function SkeletonTexts({ wordLengths, useFlex, className }: Props) {
  return (
    <>
      {wordLengths.map((length, index) => {
        const props = {
          [useFlex ? 'flex' : 'width']: useFlex ? length : `${length}rem`,
        }
        return <Skeleton key={index} className={className} {...props} />
      })}
    </>
  )
}

export default SkeletonTexts
