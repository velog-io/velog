import getTrendingPosts from '@/actions/getTrendingPost'
import TrendingPosts from '@/features/home/components/TrendingPosts'
import { Metadata } from 'next'

type Props = {
  searchParams: { timeframe: string }
}

export const metadata: Metadata = {
  alternates: { canonical: 'https://velog.io/' },
}

export default async function Home({ searchParams }: Props) {
  const { timeframe = 'week' } = searchParams
  const data = await getTrendingPosts({ timeframe, limit: 20 })

  return (
    <>
      <TrendingPosts data={data} />
    </>
  )
}
