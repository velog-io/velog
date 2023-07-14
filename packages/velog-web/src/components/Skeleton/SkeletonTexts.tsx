import Skeleton from '@/components/Skeleton/Skeleton'

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
