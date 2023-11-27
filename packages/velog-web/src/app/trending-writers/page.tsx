import TrendingWriterGrid from '@/features/TrendingWriter/components/TrendingWriterGrid'
import TrendingWriterHeader from '@/features/TrendingWriter/components/TrendingWriterHeader'
import getTrendingWriters from '@/prefetch/getTrendingWriters'

type Props = {}

export default async function Page({}: Props) {
  const writers = await getTrendingWriters()

  return (
    <>
      <TrendingWriterHeader />
      <TrendingWriterGrid initialData={writers} />
    </>
  )
}
