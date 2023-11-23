import TrendingWriterGrid from '@/features/TrendingWriter/components/TrendingWriterGrid'
import TrendingWriterHeader from '@/features/TrendingWriter/components/TrendingWriterHeader'

type Props = {}

export default function Page({}: Props) {
  return (
    <>
      <TrendingWriterHeader />
      <TrendingWriterGrid />
    </>
  )
}
