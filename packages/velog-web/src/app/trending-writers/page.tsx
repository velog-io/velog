import TrendingWriterGrid from '@/features/trendingWriter/components/TrendingWriterGrid'
import TrendingWriterHeader from '@/features/trendingWriter/components/TrendingWriterHeader'
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
